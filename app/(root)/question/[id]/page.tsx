import ROUTES from "@/app/constants/routes";

import Answers from "@/components/answer/Answers";
import TagCard from "@/components/cards/TagCard";

import Comments from "@/components/comment/Comments";
import { Preview } from "@/components/editor/Preview";
import AnswerForm from "@/components/forms/AnswerForm";
import CommentForm from "@/components/forms/CommentForm";
import Metric from "@/components/Metric";
import SaveQuestion from "@/components/questions/SaveQuestion";
import SocialShare from "@/components/SocialShare";
import { Separator } from "@/components/ui/separator";
import UserAvatar from "@/components/ui/UserAvatar";
import Votes from "@/components/votes/Votes";
import { getAnswers } from "@/lib/actions/answer.action";
import { hasSavedQuestion } from "@/lib/actions/collection.action";
import { getQuestionComments } from "@/lib/actions/comment.action";
import { getQuestion } from "@/lib/actions/question.action";
import { hasVoted } from "@/lib/actions/vote.action";
import { formatNumber, getTimeStamp } from "@/lib/utils";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import View from "../View";
import { getUserNotifications } from "@/lib/actions/notification.action";

const QuestionDetails = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string }>;
}) => {
  const { id } = await params;
  const { page, pageSize, filter } = await searchParams;

  const { data: question, success } = await getQuestion({ questionId: id });
  // console.log("question data in question details page:", question);
  if (!success || !question) return redirect("/404");

  const { data } = await getQuestionComments({
    questionId: id,
    type: "question",
  });
  // console.log("question comments data:", data);
  const {
    success: ok,
    data: answers,
    error,
  } = await getAnswers({
    questionId: id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 5,
    filter,
  });
  const hasVotedPromise = hasVoted({
    targetId: question._id,
    targetType: "question",
  });
  const hasSavedPromise = hasSavedQuestion({ questionId: question._id });

  const {
    author,
    createdAt,
    answers: totalAnswers,
    views,
    tags,
    content,
    title,
  } = question;
  return (
    <>
      <View questionId={id} />
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between">
          <div className="flex items-center justify-start gap-1.5">
            <UserAvatar
              id={author._id}
              name={author.name}
              img={author.image}
              className="size-[22px]"
              fallbackClassName="text-[10px]"
            />
            <Link href={ROUTES.PROFILE(author._id)}>
              <p className="paragraph-semibold text-dark300_light700">
                {author.name}
              </p>
            </Link>
          </div>

          <div className="flex justify-end items-center gap-4">
            <Suspense fallback={<div>Loading...</div>}>
              <Votes
                upvotes={question.upvotes}
                downvotes={question.downvotes}
                targetId={question._id}
                targetType="question"
                hasVotedPromise={hasVotedPromise}
              />
            </Suspense>
            <Suspense fallback={<div>Loading...</div>}>
              <SaveQuestion
                questionId={question._id}
                hasSavedPromise={hasSavedPromise}
              />
            </Suspense>
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full ">
          {title}
        </h2>
      </div>
      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/icons/clock.svg"
          alt="clock icon"
          value={`${getTimeStamp(new Date(createdAt))}`}
          title=""
          textStyles="small-regular text-dark300_light700"
        />
        <Metric
          imgUrl="/icons/message.svg"
          alt="message icon"
          value={totalAnswers}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          imgUrl="/icons/eye.svg"
          alt="eye icon"
          value={formatNumber(views)}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
      </div>

      <Preview content={content} question />
      <div className="flex justify-between items-center flex-wrap">
        <div className="mt-8 flex flex-wrap gap-2 mb-4">
          {tags.map((tag) => (
            <TagCard key={tag._id} _id={tag._id} name={tag.name} compact />
          ))}
        </div>
        <SocialShare
          title={title}
          url={`http://localhost:3000/question/${id}`}
        />
      </div>

      <CommentForm targetId={id} type="question" />

      <Separator className="mt-4 text-red-500" />

      <Comments
        comments={data?.comments as Comment[]}
        type="question"
        targetId={id}
      />

      <Answers
        page={Number(page) || 1}
        isNext={answers?.isNext || false}
        success={success}
        data={(answers?.answers as any) || []}
        error={error}
        totalAnswers={answers?.totalAnswers || 0}
        questionId={id}
      />
      <AnswerForm
        questionId={question._id}
        title={question.title}
        content={question.content}
        authorName={question.author.name}
        authorId={question.author._id}
        // userAnswer={question.content}
      />
    </>
  );
};

export default QuestionDetails;
