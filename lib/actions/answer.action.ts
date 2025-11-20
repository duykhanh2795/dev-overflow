"use server";
import ROUTES from "@/app/constants/routes";
import { Question, Vote } from "@/database";
import Answer, { IAnswerDoc } from "@/database/answer.model";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { NotFoundError, UnauthorizedError } from "../http-errors";
import {
  AnswerServerSchema,
  DeleteAnswerSchema,
  EditAnswerSchema,
  GetAnswersSchema,
} from "../validation";

export async function createAnswer(
  params: CreateAnswerParams
): Promise<ActionResponse<IAnswerDoc>> {
  const validatedResult = await action({
    params,
    schema: AnswerServerSchema,
    authorize: true,
  });
  if (validatedResult instanceof Error)
    return handleError(validatedResult) as ErrorResponse;

  const { content, questionId } = validatedResult.params!;
  const userId = validatedResult.session?.user?.id;
  if (!userId) {
    return handleError(
      new UnauthorizedError("User not authenticated")
    ) as ErrorResponse;
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const question = await Question.findById(questionId).session(session);
    if (!question) throw new Error("Question not found");

    const [newAnswer] = await Answer.create(
      [
        {
          author: userId,
          content,
          question: questionId,
          editHistory: [{ content, editedAt: new Date() }],
        },
      ],
      { session }
    );
    if (!newAnswer) throw new Error("Failed to create answer");
    newAnswer.editHistory = [];
    question.answers += 1;
    await question.save({ session });
    await session.commitTransaction();

    revalidatePath(ROUTES.QUESTION(questionId));
    return {
      success: true,
      data: JSON.parse(JSON.stringify(newAnswer)),
    };
  } catch (error) {
    if (session.inTransaction()) await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}
export async function getAnswers(params: GetAnswersParams): Promise<
  ActionResponse<{
    answers: IAnswerDoc[];
    answersWithPage: Answer[];
    totalAnswers: number;
    isNext: boolean;
  }>
> {
  const validatedResult = await action({ params, schema: GetAnswersSchema });
  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }
  const {
    questionId,
    page = 1,
    pageSize = 10,
    filter,
  } = validatedResult.params!;

  let sortCriteria = {};
  switch (filter) {
    case "highest upvotes":
      sortCriteria = { upvotes: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "lastest":
      sortCriteria = { createdAt: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
  }
  const skip = (page - 1) * pageSize;
  try {
    const totalAnswers = await Answer.countDocuments({ question: questionId });

    const answers = await Answer.find({ question: questionId })
      .populate("author", "_id name image")
      .populate("question", "_id title content")
      .sort(sortCriteria)
      .skip(skip)
      .limit(pageSize);
    const allAnswers = await Answer.find({ question: questionId })
      .populate("author", "_id name image")
      .sort(sortCriteria);
    const isNext = totalAnswers > answers.length + skip;
    const allAnswersWithPage = allAnswers.map((answer, index) => {
      const page = Math.floor(index / pageSize) + 1;
      return {
        ...answer.toObject(),
        page,
      };
    });

    // ✅ Lấy ra các câu trả lời chỉ trong trang hiện tại
    // const answersForCurrentPage = allAnswersWithPage.slice(skip, skip + pageSize);
    // console.log("allAnswersWithPage", allAnswersWithPage);
    return {
      success: true,
      data: {
        answers: JSON.parse(JSON.stringify(answers)),
        answersWithPage: JSON.parse(JSON.stringify(allAnswersWithPage)),
        totalAnswers,
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function deleteAnswer(params: {
  answerId: string;
}): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: DeleteAnswerSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { answerId } = validationResult.params!;
  const { user } = validationResult.session!;

  try {
    const answer = await Answer.findById(answerId);
    if (!answer) throw new NotFoundError("Answer not found");

    if (answer.author.toString() !== user?.id)
      throw new Error("You're not allowed to delete this answer");

    // reduce the question answers count
    await Question.findByIdAndUpdate(
      answer.question,
      { $inc: { answers: -1 } },
      { new: true }
    );

    // delete votes associated with answer
    await Vote.deleteMany({ actionId: answerId, actionType: "answer" });

    // delete the answer
    await Answer.findByIdAndDelete(answerId);

    // log the interaction
    // after(async () => {
    //   await createInteraction({
    //     action: "delete",
    //     actionId: answerId,
    //     actionTarget: "answer",
    //     authorId: user?.id as string,
    //   });
    // });

    revalidatePath(`/profile/${user?.id}`);

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function EditAnswer(
  params: EditAnswerParams
): Promise<ActionResponse<Answer>> {
  const validatedResult = await action({
    params,
    schema: EditAnswerSchema,
    authorize: true,
  });
  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }
  const { answerId, content } = validatedResult.params!;
  const { user } = validatedResult.session!;
  try {
    const answer = await Answer.findById(answerId);
    if (!answer) throw new NotFoundError("Answer not found");

    if (answer.author.toString() !== user?.id)
      throw new Error("You're not allowed to edit this answer");

    answer.editHistory = answer.editHistory || [];
    answer.editHistory.push({
      content: content,
      editedAt: new Date(),
    });
    answer.content = content;
    await answer.save();
    return {
      success: true,
      data: JSON.parse(JSON.stringify(answer)),
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function getAnswer(params: {
  answerId: string;
}): Promise<ActionResponse<Answer>> {
  const validatedResult = await action({
    params,
    schema: DeleteAnswerSchema,
  });
  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }
  const { answerId } = validatedResult.params!;
  try {
    const answer = await Answer.findById(answerId).populate(
      "question",
      "_id title content"
    );
    if (!answer) throw new NotFoundError("Answer not found");
    return {
      success: true,
      data: JSON.parse(JSON.stringify(answer)),
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
