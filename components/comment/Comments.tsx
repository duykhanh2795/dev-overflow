import { getQuestionComments } from "@/lib/actions/comment.action";
import AnswerCommentCard from "../cards/AnswerCommentCard";
import CommentCard from "../cards/CommentCard";

const Comments = async ({
  comments,
  type,
  targetId,
}: {
  comments: Comment[];
  type: string;
  targetId: string;
}) => {
  const result = await getQuestionComments({
    questionId: targetId as string,
    type: "user",
  });
  const allComment = result.data?.comments || [];
  // console.log("all comments", comments);
  return (
    <div className="mt-2 ml-4">
      {comments.map((c: Comment, i) =>
        type === "answer" ? (
          <div className="mb-4">
            <AnswerCommentCard
              key={i}
              comment={c}
              answerId={targetId as string}
              userReplyComments={allComment}
            />
          </div>
        ) : (
          <CommentCard key={c._id} comment={c} />
        )
      )}
    </div>
  );
};

export default Comments;
