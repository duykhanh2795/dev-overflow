"use server";
import { Answer } from "@/database";
import Comment from "@/database/comment.model";
import Notification from "@/database/notification.model";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { UnauthorizedError } from "../http-errors";
import {
  CreateNotificationSchema,
  DeleteNotificationSchema,
  GetUserNotificationsSchema,
  MarkAllAsReadSchema,
  MarkAsReadSchema,
} from "../validation";
import { getUserAnswersWithPagination } from "./user.action";

export async function createNotification(
  params: CreateNotificationParams
): Promise<ActionResponse<userNotification>> {
  const validatedResult = await action({
    params,
    schema: CreateNotificationSchema,
    authorize: true,
  });
  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }
  const { targetId, refId, receiver, type, message } = validatedResult.params!;
  const userId = validatedResult.session?.user?.id!;
  if (!userId) {
    return handleError(
      new UnauthorizedError("User not authenticated")
    ) as ErrorResponse;
  }
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const [newNotification] = await Notification.create(
      [
        {
          targetId,
          refId,
          sender: userId,
          receiver,
          type,
          message: message,
          isRead: false,
        },
      ],
      { session }
    );
    if (!newNotification) {
      throw new Error("Failed to create notification");
    }
    const populatedNotification = await Notification.findById(
      newNotification._id
    )
      .populate("sender", "_id name image")
      .populate("receiver", "_id name image")
      .session(session);
    await session.commitTransaction();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(populatedNotification)),
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
export async function getUserNotifications({
  userId,
}: {
  userId: string;
}): Promise<ActionResponse<{ notifications: AnswerNotification[] }>> {
  const validatedResult = await action({
    params: { userId },
    schema: GetUserNotificationsSchema,
    authorize: true,
  });
  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }
  try {
    const notifications = await Notification.find({ receiver: userId })
      .populate("sender", "_id name image")
      .populate("receiver", "_id name image")
      .sort({ createdAt: -1 });

      console.log("fetched notifications:", notifications);
    const senderIds = [
      ...new Set(notifications.map((n) => n.sender._id.toString())),
    ];
    const userAnswersMap = new Map<string, any[]>();
    for (const senderId of senderIds) {
      const result = await getUserAnswersWithPagination({
        userId: senderId.toString(),
      });
      const { answers } = result.data!;
      userAnswersMap.set(senderId, answers);
    }

    const abc = notifications.map((n) => {
      const answerInNotification = userAnswersMap
        .get(n.sender._id.toString())
        ?.find((ans) => ans._id.toString() === n.refId.toString());
      if (answerInNotification) {
        // console.log("answerInNotification", answerInNotification);
        return { ...n.toObject(), page: answerInNotification.page };
      }
      return { ...n.toObject() };
    });
    const test = await Promise.all(
      abc.map(async (n) => {
        if (n.type === "comment") {
          const result = await Comment.findById(n.refId);

          if (!result) return n;

          const answerDoc = await Answer.findById(result.targetId).select(
            "author"
          );

          if (!answerDoc) return n;

          const senderId = answerDoc.author.toString();
          // console.log("senderId", senderId);
          const answerId = result.targetId.toString();
          // console.log(
          //   "userAnswersMap",
          //   userAnswersMap.get(senderId.toString())
          // );
          const answerInNotification = userAnswersMap
            .get(senderId.toString())
            ?.find((ans) => ans._id.toString() === answerId.toString());

          if (answerInNotification) {
            return { ...n, page: answerInNotification.page };
          }
        }
        return n;
      })
    );

    console.log("testNotifications", test);
    // console.log("answersWịthPageNotifications", answersWithPageNotifications);
    return {
      success: true,
      data: {
        notifications: JSON.parse(JSON.stringify(notifications)),
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function deleteNotification(params: {
  notificationId: string;
}): Promise<ActionResponse> {
  const validatedResult = await action({
    params,
    schema: DeleteNotificationSchema,
    authorize: true,
  });
  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }
  const { notificationId } = validatedResult.params!;
  const { user } = validatedResult.session!;
  try {
    const notification = await Notification.findById(notificationId);
    if (
      notification.receiver.toString() !== user?.id &&
      notification.sender.toString() !== user?.id
    ) {
      throw new UnauthorizedError(
        "You are not allowed to delete this notification"
      );
    }
    await Notification.findByIdAndDelete(notificationId);
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function markAllNotificationAsRead(params: {
  userId: string;
}): Promise<ActionResponse> {
  const validatedResult = await action({
    params,
    schema: MarkAllAsReadSchema,
    authorize: true,
  });
  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }
  const { userId } = validatedResult.params!;
  try {
    await Notification.updateMany(
      { receiver: userId, isRead: false },
      { isRead: true }
    );
    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function markNotificationAsRead(params: {
  notificationId: string;
}): Promise<ActionResponse> {
  const validatedResult = await action({
    params,
    schema: MarkAsReadSchema,
    authorize: true,
  });
  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse;
  }
  const { notificationId } = validatedResult.params!;
  try {
    await Notification.findByIdAndUpdate(notificationId, { isRead: true });

    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
