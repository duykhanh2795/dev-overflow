import ROUTES from "@/app/constants/routes";
import { getQuestionComments } from "@/lib/actions/comment.action";
import { hasVoted } from "@/lib/actions/vote.action";
import { cn, getTimeStamp } from "@/lib/utils";
import Link from "next/link";
import { Suspense } from "react";
import Comments from "../comment/Comments";
import { Preview } from "../editor/Preview";
import CommentForm from "../forms/CommentForm";
import UserAvatar from "../ui/UserAvatar";
import EditDeleteAction from "../user/EditDeleteAction";
import Votes from "../votes/Votes";

interface Props extends Answer {
  containerClasses?: string;
  showReadMore?: boolean;
  showActionBtns?: boolean;
  page?: number;
}
const AnswerCard = async ({
  _id,
  author,
  content,
  createdAt,
  upvotes,
  downvotes,
  question,
  containerClasses,
  showReadMore = false,
  showActionBtns = false,
  page,
}: Props) => {
  const hasVotedPromise = hasVoted({
    targetId: _id,
    targetType: "answer",
  });
  const { data } = await getQuestionComments({
    questionId: _id.toString(),
    type: "answer",
  });
  return (
    <article
      className={cn(
        "border-[#c9caca] border-b py-10 relative",
        containerClasses
      )}
    >
      <span id={`answer-${_id}`} className="hash-span" />

      <div className="mb-5 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <div className="flex flex-1 items-start gap-1 sm:items-center">
          <UserAvatar
            id={author._id}
            name={author.name}
            img={author.image}
            className="size-5 rounded-full object-cover max-sm:mt-2"
          />

          <Link
            href={ROUTES.PROFILE(author._id)}
            className="flex flex-col max-sm:ml-1 sm:flex-row sm:items-center"
          >
            <p className="body-semibold text-dark300_light700">
              {author.name ?? "Anonymous"}
            </p>

            <p className="small-regular text-light400_light500 ml-0.5 mt-0.5 line-clamp-1">
              <span className="max-sm:hidden"> • </span>
              answered {getTimeStamp(createdAt)}
            </p>
          </Link>
        </div>

        <div className="flex justify-end mr-10">
          <Suspense fallback={<div>Loading...</div>}>
            <Votes
              targetType="answer"
              targetId={_id}
              hasVotedPromise={hasVotedPromise}
              upvotes={upvotes}
              downvotes={downvotes}
            />
          </Suspense>
        </div>
        {showActionBtns && (
          <div className="background-light800 flex-center absolute size-9 rounded-full top-0 right-0 mt-8">
            <EditDeleteAction type="Answer" itemId={_id} />
          </div>
        )}
      </div>

      <Preview content={content} />

      {showReadMore ? (
        <Link
          href={`/question/${question}${page && page > 1 ? `?page=${page}` : ""}#answer-${_id}`}
          className="body-semibold relative z-10 font-space-grotesk text-primary-500"
        >
          <p className="mt-1">Read more...</p>
        </Link>
      ) : (
        <>
          <CommentForm
            type="answer"
            cls="[&[open]>summary]:hidden"
            targetId={_id.toString()}
          />
          <Comments
            comments={data?.comments as Comment[]}
            type="answer"
            targetId={_id.toString()}
          />
        </>
      )
      }
    </article>
  );
};
export default AnswerCard;
