import { model, models, Schema, Types } from "mongoose";

export interface INotification {
  targetId: Types.ObjectId;
  refId?: string;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  type: "question" | "answer" | "comment";
  message: string;
  isRead: boolean;
}

const NotificationSchema = new Schema<INotification>(
  {
    targetId: { type: Schema.Types.ObjectId, required: true },
    refId: { type: String, default: "" },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["question", "answer", "comment"], required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);
const Notification =
  models?.Notification ||
  model<INotification>("Notification", NotificationSchema);
export default Notification;
