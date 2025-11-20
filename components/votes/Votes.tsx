"use client";
import { createVote } from "@/lib/actions/vote.action";
import { formatNumber } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { use, useState } from "react";
import { toast } from "sonner";

const Votes = ({
  upvotes,
  downvotes,
  targetId,
  targetType,
  hasVotedPromise,
}: {
  upvotes: number;
  downvotes: number;
  targetId: string;
  targetType: "question" | "answer";
  hasVotedPromise: Promise<ActionResponse<HasVotedResponse>>;
}) => {
  const session = useSession();
  const userId = session.data?.user?.id;
  const [isLoading, setIsLoading] = useState(false);
  const { data } = use(hasVotedPromise);
  const { hasUpvoted, hasDownvoted } = data! || {};
  const handleVote = async (voteType: "upvote" | "downvote") => {
    if (!userId) {
      return toast.warning("Please log in to vote.");
    }
    setIsLoading(true);

    try {
      const result = await createVote({ targetId, targetType, voteType });
      if (!result.success) {
        return toast.error(
          result?.error?.message || "Failed to fetch vote status."
        );
      }
      const message =
        (voteType === "upvote"
          ? `${!hasUpvoted ? "Upvoted" : "Unvoted"} `
          : `${!hasDownvoted ? "Downvoted" : "Undownvoted"} `) +
        "successfully.";
      toast.success(message);
    } catch (error) {
      toast.error("An error occurred while processing your vote.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={hasUpvoted ? "/icons/upvoted.svg" : "/icons/upvote.svg"}
            width={18}
            height={18}
            alt="upvote icon"
            className={`cursor-pointer ${isLoading && "hover:opacity-70"}`}
            onClick={() => !isLoading && handleVote("upvote")}
          />
          <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatNumber(upvotes)}
            </p>
          </div>
        </div>
        <div className="flex-center gap-1.5">
          <Image
            src={hasDownvoted ? "/icons/downvoted.svg" : "/icons/downvote.svg"}
            width={18}
            height={18}
            alt="downvote icon"
            className={`cursor-pointer ${isLoading && "hover:opacity-70"}`}
            onClick={() => !isLoading && handleVote("downvote")}
          />
          <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatNumber(downvotes)}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Votes;
