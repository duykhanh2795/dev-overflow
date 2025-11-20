import { Document, model, models, Schema, Types } from "mongoose";

export interface IComment {
  content: string;
  author: Types.ObjectId;
  targetId: Types.ObjectId;
  type: "question" | "answer" | "user";
  upvotes: number;
  replyToUser?: Types.ObjectId | null;
  edited: boolean;
}

export interface ICommentDoc extends IComment, Document {}

const CommentSchema = new Schema<IComment>(
  {
    content: { type: String, required: true },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["question", "answer", "user"],
      required: true,
    },
    upvotes: { type: Number, default: 0 },
    replyToUser: { type: Schema.Types.ObjectId, ref: "Comment", default: null },
    edited: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Comment = models?.Comment || model<IComment>("Comment", CommentSchema);

export default Comment;
