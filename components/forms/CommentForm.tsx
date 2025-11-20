"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useSocket } from "@/context/Socket";
import { createComment, editComment } from "@/lib/actions/comment.action";
import { createNotification } from "@/lib/actions/notification.action";
import { CommentSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { notFound, usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

const CommentForm = ({
  targetId,
  replyToUserId,
  type,
  comment,
  isEdit = false,
  title = "Add a comment",
  onCancel,
  cls,
}: {
  targetId?: string;
  replyToUserId?: string;
  type: "question" | "answer" | "user";
  comment?: Comment;
  isEdit?: boolean;
  title?: string;
  onCancel?: () => void;
  cls?: string;
}) => {
  const form = useForm<z.infer<typeof CommentSchema>>({
    resolver: zodResolver(CommentSchema),
    defaultValues: {
      content: comment?.content || "",
    },
  });
  // const [isEditing, setIsEditing] = useState(isEdit || false);
  const ref = useRef<HTMLDetailsElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();
  const { socket } = useSocket();
  const { data } = session || {};
  const pathname = usePathname();
  const questionId = pathname?.match(/[a-fA-F0-9]{24}$/)?.[0] ?? null;
  if (!questionId) return notFound();
  const handleSubmit: SubmitHandler<z.infer<typeof CommentSchema>> = async (
    data
  ) => {
    console.log("targetId:", targetId);
    try {
      if (isEdit && comment) {
        const result = await editComment({
          commentId: comment._id,
          content: data.content,
        });
        if (result.success) {
          toast.success("Comment edited successfully");
          if (ref.current) {
            ref.current.open = false;
          }
        } else {
          toast.error(result.error?.message || "Failed to edit comment");
        }
        if (onCancel) onCancel();
        return;
      }
      const {
        success,
        data: commentData,
        error,
      } = await createComment({
        targetId: targetId as string,
        content: data.content,
        type,
        replyToUserId: replyToUserId,
      });
      console.log("create comment result:", success, commentData, error);
      if (success && commentData) {
        form.reset();
        toast.success("Comment posted successfully");
        if (ref.current) {
          ref.current.open = false;
        }
        setIsOpen(false);
        if (onCancel) onCancel();
        console.log(
          "receiver notification comment id:",
          commentData.author._id
        );
        const result = await createNotification({
          targetId: questionId,
          refId: commentData._id as string,
          receiver: comment?.author._id || "",
          type: "comment",
          message: `${session?.data?.user?.name} has ${replyToUserId ? "replied" : "commented"} on your ${type === "user" ? "comment" : type}.`,
        });
        console.log("notification result comment:", result);
        if (socket) {
          socket.emit("sendNotification", result.data);
          console.log("Notification sent successfully:", result.data);
        }
      } else {
        toast.error(error?.message || "Failed to post comment");
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "There was a problem with your request"
      );
    }
  };
  return (
    <Form {...form}>
      <form
        className="mt-3 flex flex-col gap-3 flex-1"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                {isOpen || isEdit || replyToUserId ? (
                  <div>
                    <div className="flex gap-2 flex-1">
                      <Textarea
                        id="comment"
                        placeholder={title}
                        className="resize-none"
                        {...field}
                      />
                      <div className="flex flex-col">
                        <Button
                          className="text-white bg-blue-500 whitespace-nowrap !hover:none [&:hover]:bg-blue-600 !rounded-1.5"
                          size={"sm"}
                          type="submit"
                        >
                          Save edit
                        </Button>
                        <button
                          className="bg-transparent text-dark100_light900 mt-2"
                          onClick={() => {
                            setIsOpen(false);
                            // addAnswerComment &&
                            //   ref.current &&
                            //   (ref.current.open = false);
                            if (onCancel) onCancel();
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 border border-light-400 rounded-1.5 px-2 py-1 w-full cursor-text hover:bg-gray-100">
                    <Image
                      src={data?.user?.image || "/images/user.png"}
                      alt={data?.user?.name || "User"}
                      width={16}
                      height={16}
                      className="w-4 h-4 rounded-sm object-cover"
                    />
                    <label
                      htmlFor="comment"
                      className="cursor-pointer text-[13px] font-light flex-1"
                      onClick={() => setIsOpen(true)}
                    >
                      {title}
                    </label>
                  </div>
                )}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default CommentForm;
