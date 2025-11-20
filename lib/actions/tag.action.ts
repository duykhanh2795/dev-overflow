import { Question, Tag } from "@/database";
import { FilterQuery } from "mongoose";
import action from "../handlers/action";
import handleError from "../handlers/error";
import dbConnect from "../mongoose";
import {
  GetTagQuestionsSchema,
  PaginatedSearchParamsSchema,
} from "../validation";

export const getTags = async (
  params: PaginatedSearchParams
): Promise<ActionResponse<{ tags: Tag[]; isNext: boolean }>> => {
  const validatedResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });
  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }
  const { page = 1, pageSize = 9, query, filter } = validatedResult.params!;
  const skip = (Number(page) - 1) * pageSize;
  const fq: FilterQuery<typeof Tag> = {};
  if (query) {
    fq.$or = [{ name: { $regex: query, $options: "i" } }];
  }
  let sortCriteria = {};
  switch (filter) {
    case "popular":
      sortCriteria = { popularity: -1 };
      break;
    case "recent":
      sortCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "name":
      sortCriteria = { name: 1 };
      break;
    default:
      sortCriteria = { name: 1 };
  }
  try {
    const totalTag = await Tag.countDocuments(fq);
    const tags = await Tag.find(fq)
      .sort(sortCriteria)
      .skip(skip)
      .limit(pageSize);

    const isNext = totalTag > skip + tags.length;
    return {
      success: true,
      data: {
        tags: JSON.parse(JSON.stringify(tags)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
export async function getTagQuestions(
  params: GetTagQuestionsParams
): Promise<
  ActionResponse<{ tag: Tag; questions: Question[]; isNext: boolean }>
> {
  try {
    const validatedResult = await action({
      params,
      schema: GetTagQuestionsSchema,
    });
    if (validatedResult instanceof Error) {
      return handleError(validatedResult) as ErrorResponse;
    }
    const { page = 1, pageSize = 10, tagId, query } = validatedResult.params!;
    const skip = (Number(page) - 1) * pageSize;

    const tag = await Tag.findById(tagId);
    if (!tag) throw new Error("Tag not found");
    const fq: FilterQuery<Question> = {
      tags: { $in: [tagId] },
    };
    if (query) {
      fq.$or = [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ];
    }

    const totalQuestions = await Question.countDocuments(fq);
    const questions = await Question.find(fq)
      .select("_id title views answers upvotes downvotes author createdAt")
      .populate([
        { path: "author", select: "name image" },
        { path: "tags", select: "name" },
      ])
      .skip(skip)
      .limit(pageSize);

    const isNext = totalQuestions > skip + questions.length;

    return {
      success: true,
      data: {
        tag: JSON.parse(JSON.stringify(tag)),
        questions: JSON.parse(JSON.stringify(questions)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function getTopTags(): Promise<ActionResponse<Tag[]>> {
  try {
    await dbConnect();
    const tags = await Tag.find().sort({ question: -1 }).limit(5);
    return {
      success: true,
      data: JSON.parse(JSON.stringify(tags)),
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
