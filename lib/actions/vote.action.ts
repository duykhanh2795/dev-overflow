"use server";
import ROUTES from "@/app/constants/routes";
import { Answer, Question, Vote } from "@/database";
import mongoose, { ClientSession } from "mongoose";
import { revalidatePath } from "next/cache";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { UnauthorizedError } from "../http-errors";
import {
  CreateVoteSchema,
  HasVotedSchema,
  UpdateVoteCountSchema,
} from "../validation";

export async function updateVoteCount(
  params: UpdateVoteParams,
  session?: ClientSession
): Promise<ActionResponse> {
  const validatedResult = await action({
    params,
    schema: UpdateVoteCountSchema,
  });
  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }
  const { targetId, targetType, voteType, change } = validatedResult.params!;
  const Model = targetType === "question" ? Question : Answer;
  const updateField = voteType === "upvote" ? "upvotes" : "downvotes";
  try {
    const result = await Model.findByIdAndUpdate(
      targetId,
      { $inc: { [updateField]: change } },
      { new: true, session }
    );
    if (!result) {
      return handleError(
        new Error("Failed to update vote count")
      ) as ErrorResponse;
    }
    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function createVote(
  params: CreateVoteParams
): Promise<ActionResponse> {
  const validatedResult = await action({
    params,
    schema: CreateVoteSchema,
    authorize: true,
  });
  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }
  const { targetId, targetType, voteType } = validatedResult.params!;
  const userId = validatedResult.session?.user?.id!;
  if (!userId) {
    return handleError(
      new UnauthorizedError("User not authenticated")
    ) as ErrorResponse;
  }
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingVote = await Vote.findOne({
      author: userId,
      actionId: targetId,
      actionType: targetType,
    }).session(session);
    if (existingVote) {
      if (existingVote.voteType === voteType) {
        await existingVote
          .deleteOne({ _id: existingVote._id })
          .session(session);
        await updateVoteCount(
          { targetId, targetType, voteType, change: -1 },
          session
        );
      } else {
        await Vote.findByIdAndUpdate(
          existingVote._id,
          { voteType },
          { new: true, session }
        );
        await updateVoteCount(
          { targetId, targetType, voteType: existingVote.voteType, change: -1 },
          session
        );
        await updateVoteCount(
          {
            targetId,
            targetType,
            voteType,
            change: 1,
          },
          session
        );
      }
    } else {
      const questionOwer = await 
      await Vote.create(
        [
          {
            author: userId,
            actionId: targetId,
            actionType: targetType,
            voteType,
          },
        ],
        {
          session,
        }
      );
       
      await updateVoteCount(
        {
          targetId,
          targetType,
          voteType,
          change: 1,
        },
        session
      );
    }
    await session.commitTransaction();
    await session.endSession();
    revalidatePath(ROUTES.QUESTION(targetId));
    return { success: true };
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}
export async function hasVoted(
  params: HasVotedParams
): Promise<ActionResponse<HasVotedResponse>> {
  const validatedResult = await action({
    params,
    schema: HasVotedSchema,
    authorize: true,
  });
  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }
  const { targetId, targetType } = validatedResult.params!;
  const userId = validatedResult.session?.user?.id!;
  try {
    const vote = await Vote.findOne({
      author: userId,
      actionId: targetId,
      actionType: targetType,
    });
    if (!vote) {
      return {
        success: false,
        data: { hasUpvoted: false, hasDownvoted: false },
      };
    }
    return {
      success: true,
      data: {
        hasUpvoted: vote.voteType === "upvote",
        hasDownvoted: vote.voteType === "downvote",
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
