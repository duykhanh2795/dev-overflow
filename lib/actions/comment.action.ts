"use server";

import Comment from "@/database/comment.model";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { UnauthorizedError } from "../http-errors";
import {
  CreateCommentSchema,
  DeleteCommentSchema,
  EditCommentSchema,
  GetQuestionSchema,
} from "../validation";

export async function createComment(
  params: CreateCommentParams
): Promise<ActionResponse<Comment>> {
  console.log("[server action] createComment called with:", params);
  const validatedResult = await action({
    params,
    schema: CreateCommentSchema,
    authorize: true,
  });
  if (validatedResult instanceof Error)
    return handleError(validatedResult) as ErrorResponse;
  const { targetId, content, type, replyToUserId } = validatedResult.params!;
  const userId = validatedResult.session?.user?.id!;
  if (!userId) {
    return handleError(
      new UnauthorizedError("User not authenticated")
    ) as ErrorResponse;
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const [createdComment] = await Comment.create(
      [
        {
          targetId,
          content,
          type,
          author: userId,
          replyToUser: replyToUserId || null,
        },
      ],
      { session }
    );
    if (!createdComment) throw new Error("Failed to create comment");

    const newComment = await Comment.findById(createdComment._id)
      .populate("author", "_id name image")
      .session(session);

    await session.commitTransaction();
    revalidatePath(`/question/${targetId}`);
    return {
      success: true,
      data: JSON.parse(JSON.stringify(newComment)),
    };
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    return handleError(error as Error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function getQuestionComments(
  params: GetCommentsParams
): Promise<ActionResponse<{ comments: Comment[] }>> {
  const validatedResult = await action({
    params,
    schema: GetQuestionSchema,
    authorize: true,
  });
  if (validatedResult instanceof Error)
    return handleError(validatedResult) as ErrorResponse;
  const { questionId, type } = validatedResult.params!;
  try {
    
    const comments = await Comment.find({
      targetId: questionId,
      type,
    })
      .populate("author", "_id name image")
      .sort({ createdAt: 1 })
      .lean();
    return {
      success: true,
      data: { comments: JSON.parse(JSON.stringify(comments)) },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function editComment(
  params: EditCommentParams
): Promise<ActionResponse> {
  const validatedResult = await action({
    params,
    schema: EditCommentSchema,
    authorize: true,
  });
  if (validatedResult instanceof Error)
    return handleError(validatedResult) as ErrorResponse;
  const { commentId, content } = validatedResult.params!;
  const userId = validatedResult.session?.user?.id!;
  if (!userId) {
    return handleError(
      new UnauthorizedError("User not authenticated")
    ) as ErrorResponse;
  }
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) throw new Error("Comment not found");
    if (comment.author.toString() !== userId)
      throw new UnauthorizedError(
        "You are not authorized to edit this comment"
      );
    comment.content = content;
    comment.edited = true;
    await comment.save();
    revalidatePath(`/question/${comment.targetId.toString()}`);
    return {
      success: true,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function deleteComment(params: {
  commentId: string;
}): Promise<ActionResponse> {
  const validatedResult = await action({
    params,
    schema: DeleteCommentSchema,
    authorize: true,
  });
  if (validatedResult instanceof Error)
    return handleError(validatedResult) as ErrorResponse;
  const { commentId } = validatedResult.params!;
  const userId = validatedResult.session?.user?.id!;
  if (!userId) {
    return handleError(
      new UnauthorizedError("User not authenticated")
    ) as ErrorResponse;
  }
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) throw new Error("Comment not found");
    if (comment.author.toString() !== userId)
      throw new UnauthorizedError(
        "You are not authorized to delete this comment"
      );
    await Comment.findByIdAndDelete(commentId);
    revalidatePath(`/question/${comment.targetId.toString()}`);
    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
