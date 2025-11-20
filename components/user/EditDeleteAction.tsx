"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteAnswer } from "@/lib/actions/answer.action";
import { deleteComment } from "@/lib/actions/comment.action";
import { deleteNotification } from "@/lib/actions/notification.action";
import { deleteQuestion } from "@/lib/actions/question.action";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
const EditDeleteAction = ({
  type,
  itemId,
  editIcon = "/icons/edit.svg",
  removeIcon = "/icons/trash.svg",
  otherClasses = "",
}: {
  type: string;
  itemId: string;
  editIcon?: string;
  removeIcon?: string;
  otherClasses?: string;
}) => {
  const r = useRouter();
  const handleEdit = async (type: "Question" | "Answer") => {
    if (type === "Question") {
      r.push(`/question/${itemId}/edit`);
    } else {
      r.push(`/answer/${itemId}/edit`);
    }
  };
  const handleDelete = async () => {
    if (type === "Question") {
      await deleteQuestion({ questionId: itemId });
      toast.success("Question deleted successfully");
    } else if (type === "Answer") {
      await deleteAnswer({ answerId: itemId });
      toast.success("Answer deleted successfully");
    } else if (type === "Notification") {
      await deleteNotification({ notificationId: itemId });
      toast.success("Notification deleted successfully");
    } else if (type === "Comment") {
      await deleteComment({ commentId: itemId });
      toast.success("Comment deleted successfully");
    }
  };
  return (
    <div
      className={`flex items-center justify-end gap-3 max-sm:w-full ${otherClasses}`}
    >
      {type === "Comment" ? (
        <button
          className="text-[#a83f3f] opacity-0 group-hover:opacity-100 transition-opacity duration-150"
          onClick={handleDelete}
        >
          Delete
        </button>
      ) : (
        <>
          <Image
            src={editIcon}
            alt="Edit"
            width={14}
            height={14}
            className="cursor-pointer object-contain"
            onClick={() =>
              handleEdit(type === "Question" ? "Question" : "Answer")
            }
          />
          <AlertDialog>
            <AlertDialogTrigger className="cursor-pointer">
              {" "}
              <Image
                src={removeIcon}
                alt="Delete"
                width={14}
                height={14}
                className="cursor-pointer object-contain"
              />
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your
                  {type === "Question" ? " question" : " answer"} and remove
                  your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="btn">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </div>
  );
};

export default EditDeleteAction;
