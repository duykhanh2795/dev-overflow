"use server";

import ROUTES from "@/app/constants/routes";
import { auth } from "@/auth";
import { Answer, Collection, Interaction, Vote } from "@/database";
import Question from "@/database/question.model";
import TagQuestion from "@/database/tag-question.model";
import Tag, { ITagDoc } from "@/database/tag.model";
import mongoose, { FilterQuery, Types } from "mongoose";
import { revalidatePath } from "next/cache";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { UnauthorizedError } from "../http-errors";
import dbConnect from "../mongoose";
import {
  AskQuestionSchema,
  DeleteQuestionSchema,
  EditQuestionSchema,
  GetQuestionSchema,
  IncrementViewsSchema,
  PaginatedSearchParamsSchema,
} from "../validation";
export async function createQuestion(
  params: CreateQuestionParams
): Promise<ActionResponse<Question>> {
  const validatedResult = await action({
    params,
    schema: AskQuestionSchema,
    authorize: true,
  });
  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }

  const { title, content, tags } = validatedResult.params!;
  const userId = validatedResult.session?.user?.id!;
  if (!userId) {
    return handleError(
      new UnauthorizedError("User not authenticated")
    ) as ErrorResponse;
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [newQuestion] = await Question.create(
      [{ title, content, author: userId }],
      { session }
    );
    if (!newQuestion) {
      throw new Error("Failed to create question");
    }
    const tagIds: mongoose.Types.ObjectId[] = [];
    const TagQuestionDocuments = [];

    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`) } },
        { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
        { upsert: true, new: true, session }
      );
      tagIds.push(existingTag!._id);
      TagQuestionDocuments.push({
        tag: existingTag!._id,
        question: newQuestion._id,
      });
    }
    await TagQuestion.insertMany(TagQuestionDocuments, { session });
    await Question.findByIdAndUpdate(
      newQuestion._id,
      { $push: { tags: { $each: tagIds } } },
      { session }
    );

    await session.commitTransaction();
    return {
      success: true,
      data: JSON.parse(JSON.stringify(newQuestion)),
    };
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}

export async function editQuestion(
  params: EditQuestionParams
): Promise<ActionResponse<Question>> {
  const validatedResult = await action({
    params,
    schema: EditQuestionSchema,
    authorize: true,
  });
  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }
  const { title, content, tags, questionId } = validatedResult.params!;
  const userId = validatedResult.session?.user?.id!;
  if (!userId) {
    return handleError(
      new UnauthorizedError("User not authenticated")
    ) as ErrorResponse;
  }
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingQuestion = await Question.findById(questionId)
      .populate("tags")
      .session(session);
    if (!existingQuestion) {
      throw new Error("Question not found");
    }
    if (existingQuestion.author.toString() !== userId) {
      throw new UnauthorizedError("Not authorized to edit this question");
    }
    if (
      existingQuestion.title !== title ||
      existingQuestion.content !== content
    ) {
      existingQuestion.title = title;
      existingQuestion.content = content;
      await existingQuestion.save({ session });
    }
    const tagsToAdd = tags.filter((tag) =>
      existingQuestion.tags.some((t: ITagDoc) =>
        t.name.toLowerCase().includes(tag.toLowerCase())
      )
    );
    const tagsToRemove = existingQuestion.tags.filter((tag: ITagDoc) =>
      tags.some((t) => t.toLowerCase() === tag.name.toLowerCase())
    );
    const tagIds: mongoose.Types.ObjectId[] = [];
    const TagQuestionDocuments = [];

    if (tagsToAdd.length > 0) {
      for (const tag of tagsToAdd) {
        const existingTag = await Tag.findOneAndUpdate(
          { name: { $regex: `^${tag}$`, $options: "i" } },
          { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
          { upsert: true, new: true, session }
        );
        if (existingTag) {
          TagQuestionDocuments.push({
            tag: existingTag!._id,
            question: questionId,
          });
          existingQuestion.tags.push(existingTag._id);
        }
      }
    }
    if (tagsToRemove.length > 0) {
      const id = tagsToRemove.map((t: ITagDoc) => t._id);
      await Tag.updateMany(
        { _id: { $in: id } },
        { $inc: { questions: -1 } },
        { session }
      );
      await TagQuestion.deleteMany(
        { tag: { $in: id }, question: questionId },
        { session }
      );
      existingQuestion.tags = existingQuestion.tags.filter(
        (tagId: mongoose.Types.ObjectId) =>
          !id.some((t_id: mongoose.Types.ObjectId) => t_id.equals(tagId))
      );
    }
    if (TagQuestionDocuments.length > 0) {
      await TagQuestion.insertMany(TagQuestionDocuments, { session });
    }
    await existingQuestion.save({ session });
    await session.commitTransaction();
    return {
      success: true,
      data: JSON.parse(JSON.stringify(existingQuestion)),
    };
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}
export async function getQuestion(params: {
  questionId: string;
}): Promise<ActionResponse<Question>> {
  const validatedResult = await action({
    params,
    schema: GetQuestionSchema,
  });
  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }
  try {
    const { questionId } = validatedResult.params!;
    const question = await Question.findById(questionId)
      .populate("tags", "_id name")
      .populate("author", "_id name image");
    if (!question) {
      throw new Error("Question not found");
    }
    return {
      success: true,
      data: JSON.parse(JSON.stringify(question)),
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function getQuestions(params: PaginatedSearchParams): Promise<
  ActionResponse<{
    questions: Question[];
    isNext: boolean;
  }>
> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { page = 1, pageSize = 10, query, filter } = params;

  const skip = (Number(page) - 1) * pageSize;
  const limit = pageSize;

  const filterQuery: FilterQuery<typeof Question> = {};
  let sortCriteria = {};

  try {
    // Recommendations
    if (filter === "recommended") {
      const session = await auth();
      const userId = session?.user?.id;

      if (!userId) {
        return { success: true, data: { questions: [], isNext: false } };
      }

      const recommended = await getRecommendedQuestions({
        userId,
        query,
        skip,
        limit,
      });

      return {
        success: true,
        data: recommended
      };
    }

    // Search
    if (query) {
      filterQuery.$or = [
        { title: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ];
    }

    // Filters
    switch (filter) {
      case "newest":
        sortCriteria = { createdAt: -1 };
        break;
      case "unanswered":
        filterQuery.answers = 0;
        sortCriteria = { createdAt: -1 };
        break;
      case "popular":
        sortCriteria = { upvotes: -1 };
        break;
      default:
        sortCriteria = { createdAt: -1 };
        break;
    }

    const totalQuestions = await Question.countDocuments(filterQuery);

    const questions = await Question.find(filterQuery)
      .populate("tags", "name")
      .populate("author", "name image")
      .lean()
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const isNext = totalQuestions > skip + questions.length;

    return {
      success: true,
      data: {
        questions: JSON.parse(JSON.stringify(questions)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function IncrementViews(
  questionId: string
): Promise<ActionResponse<{ views: number }>> {
  try {
    const validatedResult = await action({
      params: { questionId },
      schema: IncrementViewsSchema,
    });
    if (validatedResult instanceof Error) {
      return handleError(validatedResult) as ErrorResponse;
    }
    const question = await Question.findById(questionId);
    if (!question) {
      throw new Error("Question not found");
    }
    question.views += 1;
    await question.save();

    revalidatePath(ROUTES.QUESTION(questionId));

    return {
      success: true,
      data: { views: question.views },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function getHotQuestions(): Promise<ActionResponse<Question[]>> {
  try {
    await dbConnect();
    const questions = await Question.find()
      .sort({ views: -1, upvotes: -1 })
      .limit(5);
    return {
      success: true,
      data: JSON.parse(JSON.stringify(questions)),
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function deleteQuestion(params: {
  questionId: string;
}): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: DeleteQuestionSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { questionId } = validationResult.params!;
  const { user } = validationResult.session!;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const question = await Question.findById(questionId).session(session);
    if (!question) throw new Error("Question not found");

    if (question.author.toString() !== user?.id)
      throw new Error("You are not authorized to delete this question");

    // Delete related entries inside the transaction
    await Collection.deleteMany({ question: questionId }).session(session);
    await TagQuestion.deleteMany({ question: questionId }).session(session);

    // For all tags of Question, find them and reduce their count
    if (question.tags.length > 0) {
      await Tag.updateMany(
        { _id: { $in: question.tags } },
        { $inc: { questions: -1 } },
        { session }
      );
    }

    //  Remove all votes of the question
    await Vote.deleteMany({
      actionId: questionId,
      actionType: "question",
    }).session(session);

    // Remove all answers and their votes of the question
    const answers = await Answer.find({ question: questionId }).session(
      session
    );

    if (answers.length > 0) {
      await Answer.deleteMany({ question: questionId }).session(session);

      await Vote.deleteMany({
        actionId: { $in: answers.map((answer) => answer.id) },
        actionType: "answer",
      }).session(session);
    }

    await Question.findByIdAndDelete(questionId).session(session);

    // log the interaction
    // after(async () => {
    //   await CreateInteractionSchema({
    //     action: "delete",
    //     actionId: questionId,
    //     actionTarget: "question",
    //     authorId: user?.id as string,
    //   });
    // });

    await session.commitTransaction();
    session.endSession();

    revalidatePath(`/profile/${user?.id}`);

    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    return handleError(error) as ErrorResponse;
  }
}
// export async function getRecommendedQuestions({
//   userId,
//   query,
//   skip,
//   limit,
// }: RecommendationParams) {
//   const interactions = await Interaction.find({
//     user: new Types.ObjectId(userId),
//     actionType: "question",
//     action: { $in: ["view", "upvote", "post", "bookmark"] },
//   })
//     .sort({ createdAt: -1 })
//     .limit(50)
//     .lean();
//   const interactedQuestionIds = interactions.map((i) => i.actionId);
//   const interactedQuestion = await Question.find({
//     _id: { $in: interactedQuestionIds },
//   }).select("tags");
//   const allTags = interactedQuestion.flatMap((q) =>
//     q.tags.map((t: Types.ObjectId) => t.toString())
//   );
//   const uqTagIds = [...new Set(allTags)];
//   const recommendedQuery: FilterQuery<typeof Question> = {
//     _id: { $nin: interactedQuestionIds },
//     tags: { $in: uqTagIds.map((id) => new Types.ObjectId(id)) },
//     author: { $ne: new Types.ObjectId(userId) },
//   };
//   if (query) {
//     recommendedQuery.$or = [
//       { title: { $regex: new RegExp(query, "i") } },
//       { content: { $regex: new RegExp(query, "i") } },
//     ];
//   }
//   const totalQuestions = await Question.countDocuments(recommendedQuery);

//   const questions = await Question.find(recommendedQuery)
//     .populate("tags", "name")
//     .populate("author", "name image")
//     .sort({ upvotes: -1, views: -1 })
//     .skip(skip)
//     .limit(limit)
//     .lean();
//   return {
//     success: true,
//     data: {
//       questions: JSON.parse(JSON.stringify(questions)),
//       isNext: totalQuestions > skip + questions.length,
//     },
//   };
// }
export async function getRecommendedQuestions({
  userId,
  query,
  skip,
  limit,
}: RecommendationParams) {
  const interactions = await Interaction.find({
    user: new Types.ObjectId(userId),
    actionType: "question",
    action: { $in: ["view", "upvote", "bookmark", "post"] },
  })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  const interactedQuestionIds = interactions.map((i) => i.actionId);

  const interactedQuestions = await Question.find({
    _id: { $in: interactedQuestionIds },
  }).select("tags");

  const allTags = interactedQuestions.flatMap((q) =>
    q.tags.map((tag: Types.ObjectId) => tag.toString())
  );

  const uniqueTagIds = [...new Set(allTags)];

  const recommendedQuery: FilterQuery<typeof Question> = {
    _id: { $nin: interactedQuestionIds },
    author: { $ne: new Types.ObjectId(userId) },
    tags: { $in: uniqueTagIds.map((id) => new Types.ObjectId(id)) },
  };

  if (query) {
    recommendedQuery.$or = [
      { title: { $regex: query, $options: "i" } },
      { content: { $regex: query, $options: "i" } },
    ];
  }

  const total = await Question.countDocuments(recommendedQuery);

  const questions = await Question.find(recommendedQuery)
    .populate("tags", "name")
    .populate("author", "name image")
    .sort({ upvotes: -1, views: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    questions: JSON.parse(JSON.stringify(questions)),
    isNext: total > skip + questions.length,
  };
}
