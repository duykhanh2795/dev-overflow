"use server";

import ROUTES from "@/app/constants/routes";
import { Collection, Question } from "@/database";
import { PipelineStage, Types } from "mongoose";
import { revalidatePath } from "next/cache";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { UnauthorizedError } from "../http-errors";
import {
  CollectionBaseSchema,
  PaginatedSearchParamsSchema,
} from "../validation";

export async function saveQuestion(
  params: CollectionParams
): Promise<ActionResponse<{ saved: boolean }>> {
  const validatedResult = await action({
    params,
    schema: CollectionBaseSchema,
    authorize: true,
  });
  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }
  const { questionId } = validatedResult.params!;
  const userId = validatedResult.session?.user?.id!;
  if (!userId) {
    return handleError(
      new UnauthorizedError("User not authenticated")
    ) as ErrorResponse;
  }
  try {
    const question = await Question.findById(questionId);
    if (!question) {
      throw new Error("Question not found");
    }
    const collection = await Collection.findOne({
      question: questionId,
      author: userId,
    });
    if (collection) {
      await Collection.findByIdAndDelete(collection._id);
      revalidatePath(ROUTES.QUESTION(questionId));
      return {
        success: true,
        data: { saved: false },
      };
    }
    await Collection.create({ question: questionId, author: userId });
    revalidatePath(ROUTES.QUESTION(questionId));
    return {
      success: true,
      data: { saved: true },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function hasSavedQuestion(
  params: CollectionParams
): Promise<ActionResponse<{ saved: boolean }>> {
  const validatedResult = await action({
    params,
    schema: CollectionBaseSchema,
    authorize: true,
  });
  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }
  const { questionId } = validatedResult.params!;
  const userId = validatedResult.session?.user?.id!;
  if (!userId) {
    return handleError(
      new UnauthorizedError("User not authenticated")
    ) as ErrorResponse;
  }
  try {
    const collection = await Collection.findOne({
      question: questionId,
      author: userId,
    });

    return {
      success: true,
      data: { saved: !!collection },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function getSavedQuestion(
  params: PaginatedSearchParams
): Promise<ActionResponse<{ collections: Collection[]; isNext: boolean }>> {
  const validatedResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
    authorize: true,
  });
  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }
  const userId = validatedResult.session?.user?.id!;
  if (!userId) {
    return handleError(
      new UnauthorizedError("User not authenticated")
    ) as ErrorResponse;
  }
  const {
    page = 1,
    pageSize = 10,
    query,
    filter,
  } = await validatedResult.params!;
  const skip = (Number(page) - 1) * pageSize;
  const sortOptions: Record<string, Record<string, 1 | -1>> = {
    mostrecent: { "question.createdAt": -1 },
    oldest: { "question.createdAt": 1 },
    mostvoted: { "question.upvotes": -1 },
    mostviewed: { "question.views": -1 },
    mostanswerd: { "question.answers": -1 },
  };

  const sortCriteria = sortOptions[filter as keyof typeof sortOptions] || {
    "question.createdAt": -1,
  };
  try {
    const pipeline: PipelineStage[] = [
      { $match: { author: new Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "questions",
          localField: "question",
          foreignField: "_id",
          as: "question",
        },
      },
      { $unwind: "$question" },
      {
        $lookup: {
          from: "users",
          localField: "question.author",
          foreignField: "_id",
          as: "question.author",
        },
      },
      { $unwind: "$question.author" },
      {
        $lookup: {
          from: "tags",
          localField: "question.tags",
          foreignField: "_id",
          as: "question.tags",
        },
      },
    ];

    if (query) {
      pipeline.push({
        $match: {
          $or: [
            { "question.title": { $regex: query, $options: "i" } },
            { "question.content": { $regex: query, $options: "i" } },
          ],
        },
      });
    }
    const [totalCount] = await Collection.aggregate([
      ...pipeline,
      { $count: "count" },
    ]);

    pipeline.push(
      { $sort: sortCriteria },
      { $skip: skip },
      { $limit: pageSize }
    );
    pipeline.push({ $project: { question: 1, author: 1 } });

    const questions = await Collection.aggregate(pipeline);

    const isNext = totalCount.count > skip + questions.length;

    return {
      success: true,
      data: {
        collections: JSON.parse(JSON.stringify(questions)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
