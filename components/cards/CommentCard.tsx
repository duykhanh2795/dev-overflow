"use client";

import { getTimeStamp } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import CommentForm from "../forms/CommentForm";
import EditDeleteAction from "../user/EditDeleteAction";

export default function CommentCard({ comment }: { comment: Comment }) {
  const [isEditing, setIsEditing] = useState(false);
  const session = useSession();
  return (
    <div className="group flex gap-2 py-1 text-sm text-gray-800 border-b border-[#e6e6e6] dark:border-gray-800">
      {isEditing ? (
        <CommentForm
          type="question"
          comment={comment}
          isEdit={isEditing}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <div className="flex">
          <p className="leading-snug">
            {/* {comment.replyToUser && (
              <span className="text-blue-700 mr-1">
                @{comment.replyToUser.name}
              </span>
            )} */}
            {comment.content}
          </p>
          <Link
            href={`/profile/${comment.author._id}`}
            className="text-[#393FAC] hover:underline"
          >
            — {comment.author.name}
          </Link>
          <span className="text-[#636B74]">
            x{getTimeStamp(comment.createdAt)}
          </span>
          {comment.author._id.toString() === session.data?.user?.id && (
            <div className="flex gap-1 ml-2.5">
              <button onClick={() => setIsEditing(true)}>Edit</button>
              <EditDeleteAction
                type="Comment"
                itemId={comment._id}
                otherClasses="ml-auto"
              />
            </div>
          )}
          {comment.edited && (
            <span className="ml-1 text-gray-400 italic">(edited)</span>
          )}
          <p className="text-xs text-gray-500 mt-1"></p>
        </div>
      )}
    </div>
  );
}
