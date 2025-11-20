"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { deleteComment } from "@/lib/actions/comment.action";
import { cn, getTimeStamp } from "@/lib/utils";
import { Ellipsis, Reply } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef, useState } from "react";
import CommentForm from "../forms/CommentForm";

export default function AnswerCommentCard({
  comment,
  answerId,
  userReplyComments,
  level = 0,
  maxLevel = 3,
}: {
  comment: Comment;
  answerId: string;
  userReplyComments: Comment[];
  level?: number;
  maxLevel?: number;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [replyingMap, setReplyingMap] = useState<Record<string, boolean>>({});
  const [highlightClassName, setHighlightClassName] = useState("");

  const realReplies = userReplyComments.filter(
    (c) => c.replyToUser?.toString() === comment._id.toString()
  );
  // console.log("realReplies", realReplies);
  const mergedReplies = [...realReplies];
  // const getCurrentHash = (): string | null => {
  //   if (typeof window === "undefined") return null;
  //   const hash = window.location.hash;
  //   return hash ? hash.slice(1) : null;
  // };

  const commentHash = `comment-${comment._id.toString()}`;
  // const isHashMatched = commentHash.includes(getCurrentHash() as string);

  const cardRef = useRef<HTMLDivElement>(null);

// useLayoutEffect(() => {
//   if (typeof window === "undefined") return;

//   const hash = window.location.hash.replace("#", "");
//   const currentId = `comment-${comment._id.toString()}`;

//   if (hash !== currentId) return;

//   const el = cardRef.current;
//   if (!el) return;

//   setTimeout(() => {
//     const offset = 75; 
//     const elTop = el.getBoundingClientRect().top + window.scrollY;

//     window.scrollTo({
//       top: elTop - offset,
//       behavior: "smooth",
//     });

//     el.classList.add("bg-yellow-100", "animate-highlight");

//     const timer = setTimeout(() => {
//       el.classList.remove("bg-yellow-100", "animate-highlight");
//     }, 8000);

//     return () => clearTimeout(timer);
//   }, 0);
// }, []);

  return (
    <div className="pt-1 text-sm text-gray-800 mt-1">
      <span id={commentHash} className="hash-span" />
      <div
        style={{ marginLeft: level * 30 }}
        ref={cardRef}
        className={cn(
          "group flex flex-col",
          // isHashMatched ? highlightClassName : ""
        )}
      >
        {isEditing ? (
          <CommentForm
            type="answer"
            comment={comment}
            isEdit
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <>
            <div className="flex items-center gap-2">
              <Image
                src={comment.author.image}
                alt={comment.author.name}
                width={24}
                height={24}
                className="rounded-sm"
              />

              <Link
                href={`/profile/${comment.author._id}`}
                className="text-[#393FAC] hover:underline"
              >
                {comment.author.name}
              </Link>

              <span className="text-[#636B74] ml-1">
                {getTimeStamp(comment.createdAt)}
              </span>
            </div>

            <div className="flex flex-col gap-1 leading-snug w-full ml-8">
              <p>{comment.content}</p>

              <div className="flex gap-1.5 mt-1">
                <button
                  onClick={() =>
                    setReplyingMap((prev) => ({ ...prev, [comment._id]: true }))
                  }
                  className="flex items-center text-gray-500 gap-1 p-[2px_6.6px] rounded-1.5 border border-light-400 hover:text-gray-700"
                >
                  <Reply className="h-4 w-4" />
                  <span className="text-[13px] font-normal">Reply</span>
                </button>

                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Ellipsis className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="!w-20">
                    <DropdownMenuItem
                      className="px-2 py-1 text-xs h-auto"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="px-2 py-1 text-xs h-auto"
                      onClick={async () =>
                        await deleteComment({ commentId: comment._id })
                      }
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {replyingMap[comment._id] && (
                <CommentForm
                  type="user"
                  targetId={answerId}
                  replyToUserId={comment._id}
                  comment={{ ...comment, content: "" }}
                  onCancel={() =>
                    setReplyingMap((prev) => ({
                      ...prev,
                      [comment._id]: false,
                    }))
                  }
                />
              )}
            </div>
          </>
        )}
      </div>

      {level < maxLevel && mergedReplies.length > 0 && (
        <div>
          {mergedReplies.map((reply) => (
            <AnswerCommentCard
              key={reply._id}
              comment={reply as Comment}
              answerId={answerId}
              userReplyComments={userReplyComments}
              level={level + 1}
              maxLevel={maxLevel}
            />
          ))}
        </div>
      )}
    </div>
  );
}
