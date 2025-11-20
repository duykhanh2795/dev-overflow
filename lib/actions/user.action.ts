"use server";
import { Answer, Question, User } from "@/database";
import { FilterQuery, PipelineStage, Types } from "mongoose";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { UnauthorizedError } from "../http-errors";
import { assignBadges } from "../utils";
import {
  GetUserQuestionsSchema,
  GetUsersAnswersSchema,
  GetUserSchema,
  PaginatedSearchParamsSchema,
  UpdateUserProfileImageSchema,
  UpdateUserSchema,
} from "../validation";
import { getAnswers } from "./answer.action";
import { revalidatePath } from "next/cache";

export async function getUsers(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ users: User[]; isNext: boolean }>> {
  const validatedResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });
  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }
  const { page = 1, pageSize = 9, filter, query } = validatedResult.params!;
  const fq: FilterQuery<User> = {};

  if (query) {
    fq.$or = [
      { name: { $regex: query, $options: "i" } },
      { username: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } },
    ];
  }
  let sortCriteria = {};

  switch (filter) {
    case "newest":
      sortCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "popular":
      sortCriteria = { reputation: -1 };
      break;

    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  const skip = (page - 1) * pageSize;
  try {
    const totalUsers = await User.countDocuments(fq);
    const users = await User.find(fq)
      .sort(sortCriteria)
      .skip(skip)
      .limit(pageSize);
    const isNext = totalUsers > users.length + skip;
    return {
      success: true,
      data: {
        users: JSON.parse(JSON.stringify(users)),
        isNext: isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function getUser(params: {
  userId: string;
}): Promise<
  ActionResponse<{ user: User; totalQuestions: number; totalAnswers: number }>
> {
  const validatedResult = await action({
    params,
    schema: GetUserSchema,
    authorize: true,
  });
  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }
  const userId = validatedResult?.session?.user?.id;
  if (!userId) {
    return handleError(
      new UnauthorizedError("User not authenticated")
    ) as ErrorResponse;
  }
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    const totalQuestions = await Question.countDocuments({ author: userId });
    const totalAnswers = await Answer.countDocuments({ author: userId });
    return {
      success: true,
      data: {
        user: JSON.parse(JSON.stringify(user)),
        totalQuestions: JSON.parse(JSON.stringify(totalQuestions)),
        totalAnswers: JSON.parse(JSON.stringify(totalAnswers)),
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function getUserQuestions(
  params: GetUserQuestionsParams
): Promise<ActionResponse<{ questions: Question[]; isNext: boolean }>> {
  const validatedResult = await action({
    params,
    schema: GetUserQuestionsSchema,
  });
  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }
  const { userId, page = 1, pageSize = 10 } = validatedResult.params!;
  const skip = (Number(page) - 1) * pageSize;
  try {
    const totalQuestions = await Question.countDocuments({ author: userId });
    const questions = await Question.find({ author: userId })
      .populate("tags", "name")
      .populate("author", "name image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);
    return {
      success: true,
      data: {
        questions: JSON.parse(JSON.stringify(questions)),
        isNext: totalQuestions > questions.length + skip,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function getUserAnswers(
  params: GetUserAnswersParams
): Promise<ActionResponse<{ answers: Answer[]; isNext: boolean }>> {
  const validatedResult = await action({
    params,
    schema: GetUsersAnswersSchema,
  });
  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }
  const { userId, page = 1, pageSize = 10 } = validatedResult.params!;
  const skip = (Number(page) - 1) * pageSize;
  try {
    const totalAnswers = await Answer.countDocuments({ author: userId });
    const answers = await Answer.find({ author: userId })
      .populate("author", "_id name image")
      .populate("question", "_id title")
      .skip(skip)
      .limit(pageSize);
    const answersWithPage = await Promise.all(
      answers.map(async (answer) => {
        const result = await getAnswers({
          questionId: answer.question._id.toString(),
          page: 1,
          pageSize: 5,
        });
        if (result.success && result.data) {
          const { answersWithPage } = result.data!;
          const found = answersWithPage.find(
            (ans) => ans._id.toString() === answer._id.toString()
          );
          if (found) {
            return { ...found };
          }
        }
        return null;
      })
    );
    console.log("answersWithPage", answersWithPage);
    return {
      success: true,
      data: {
        answers: JSON.parse(JSON.stringify(answersWithPage)),
        isNext: totalAnswers > answers.length + skip,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function getUserAnswersWithPagination(params: {
  userId: string;
}): Promise<ActionResponse<{ answers: Answer[] }>> {
  const validatedResult = await action({
    params,
    schema: GetUserSchema,
  });
  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }
  const { userId } = validatedResult.params!;
  try {
    const totalAnswers = await Answer.countDocuments({ author: userId });
    const answers = await Answer.find({ author: userId })
      .populate("author", "_id name image")
      .populate("question", "_id title");
    const answersWithPage = await Promise.all(
      answers.map(async (answer) => {
        const result = await getAnswers({
          questionId: answer.question._id.toString(),
          page: 1,
          pageSize: 5,
        });
        if (result.success && result.data) {
          const { answersWithPage } = result.data!;
          const found = answersWithPage.find(
            (ans) => ans._id.toString() === answer._id.toString()
          );
          if (found) {
            return { ...found };
          }
        }
        return null;
      })
    );
    return {
      success: true,
      data: {
        answers: JSON.parse(JSON.stringify(answersWithPage)),
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function getUserTopTags(params: { userId: string }): Promise<
  ActionResponse<{
    tags: { _id: string; name: string; count: number }[];
  }>
> {
  const validatedResult = await action({
    params,
    schema: GetUserSchema,
  });
  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }
  const { userId } = validatedResult.params!;
  try {
    const pipeline: PipelineStage[] = [
      {
        $match: { author: new Types.ObjectId(userId) },
      },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "tags",
          localField: "_id",
          foreignField: "_id",
          as: "tagInfo",
        },
      },
      { $unwind: "$tagInfo" },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $project: { _id: "$tagInfo._id", name: "$tagInfo.name", count: 1 } },
    ];
    const tags = await Question.aggregate(pipeline);
    return {
      success: true,
      data: { tags: JSON.parse(JSON.stringify(tags)) },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function getUserStats(params: { userId: string }): Promise<
  ActionResponse<{
    totalQuestions: number;
    totalAnswers: number;
    badges: Badges;
  }>
> {
  const validationResult = await action({
    params,
    schema: GetUserSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { userId } = params;

  try {
    const [questionStats] = await Question.aggregate([
      { $match: { author: new Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          upvotes: { $sum: "$upvotes" },
          views: { $sum: "$views" },
        },
      },
    ]);

    const [answerStats] = await Answer.aggregate([
      { $match: { author: new Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          upvotes: { $sum: "$upvotes" },
        },
      },
    ]);

    const badges = assignBadges({
      criteria: [
        { type: "ANSWER_COUNT", count: answerStats.count },
        { type: "QUESTION_COUNT", count: questionStats.count },
        {
          type: "QUESTION_UPVOTES",
          count: questionStats.upvotes + answerStats.upvotes,
        },
        { type: "TOTAL_VIEWS", count: questionStats.views },
      ],
    });

    return {
      success: true,
      data: {
        totalQuestions: questionStats.count,
        totalAnswers: answerStats.count,
        badges,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function updateUser(
  params: UpdateUserParams
): Promise<ActionResponse<{ user: User }>> {
  const validationResult = await action({
    params,
    schema: UpdateUserSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { user } = validationResult.session!;

  try {
    const updatedUser = await User.findByIdAndUpdate(user?.id, params, {
      new: true,
    });

    return {
      success: true,
      data: { user: JSON.parse(JSON.stringify(updatedUser)) },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function updateUserProfileImage(params: {
  image: string;
}): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: UpdateUserProfileImageSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { image } = validationResult.params!;
  const { user } = validationResult.session!;

  try {
     await User.findByIdAndUpdate(user?.id, { image }, {
      new: true,
    });
    revalidatePath("/")
    return {
      success: true,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function getUserById(
  userId: string
): Promise<ActionResponse<{ user: User }>> {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    return {
      success: true,
      data: { user: JSON.parse(JSON.stringify(user)) },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}