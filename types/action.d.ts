interface SignInWithOAuthParams {
  user: {
    name: string;
    username: string;
    email: string;
    image: string;
  };
  provider: "github" | "google";
  providerAccountId: string;
}
interface AuthCredentials {
  name: string;
  username: string;
  email: string;
  password: string;
}

interface CreateQuestionParams {
  title: string;
  content: string;
  tags: string[];
}
interface CreateCommentParams {
  targetId: string;
  content?: string;
  type: "question" | "answer" | "user";
  replyToUserId?: string;
}
interface GetCommentsParams {
  questionId: string;
  type: "question" | "answer" | "user";
}
interface EditCommentParams {
  commentId: string;
  content: string;
}

interface EditQuestionParams extends CreateQuestionParams {
  questionId: string;
}
interface GetTagQuestionsParams extends Omit<PaginatedSearchParams, "filter"> {
  tagId: string;
}
interface CreateAnswerParams {
  questionId: string;
  content: string;
}
interface EditAnswerParams extends Pick<CreateAnswerParams, "content"> {
  answerId: string;
}

interface GetAnswersParams extends PaginatedSearchParams {
  questionId: string;
}

interface CreateNotificationParams {
  targetId: string;
  // sender: string;
  refId: string;
  receiver: string;
  type: "question" | "answer" | "comment";
  message: string;
}
interface CreateVoteParams {
  targetId: string;
  targetType: "question" | "answer";
  voteType: "upvote" | "downvote";
}
interface UpdateVoteParams extends CreateVoteParams {
  change: 1 | -1;
}
type HasVotedParams = Pick<CreateVoteParams, "targetId" | "targetType">;
interface HasVotedResponse {
  hasUpvoted: boolean;
  hasDownvoted: boolean;
}
interface CollectionParams {
  questionId: string;
}
interface GetUserQuestionsParams
  extends Omit<PaginatedSearchParams, "query | filter | sort"> {
  userId: string;
}
interface GetUserAnswersParams
  extends Omit<PaginatedSearchParams, "query | filter | sort"> {
  userId: string;
}
interface CreateInteractionParams {
  action:
    | "view"
    | "upvote"
    | "downvote"
    | "bookmark"
    | "post"
    | "edit"
    | "delete"
    | "search";
  actionId: string;
  authorId: string;
  actionTarget: "question" | "answer";
}
interface UpdateReputationParams {
  interaction: IInteractionDoc;
  session: mongoose.ClientSession;
  performerId: string;
  authorId: string;
}

interface RecommendationParams {
  userId: string;
  query?: string;
  skip: number;
  limit: number;
}
interface UpdateUserParams {
  name?: string;
  username?: string;
  email?: string;
  image?: string;
  password?: string;
}
interface GlobalSearchParams {
  query: string;
  type: string | null;
}
