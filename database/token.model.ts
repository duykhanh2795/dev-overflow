import { Document, Schema, model, models } from "mongoose";

export interface IToken {
  email: string;
  token: string;
  expires: Date;
}

export interface ITokenDoc extends IToken, Document {}

const TokenSchema = new Schema<IToken>(
  {
    email: { type: String, required: true },
    token: { type: String, required: true, unique: true },
    expires: { type: Date, required: true },
  },
  { timestamps: true }
);

TokenSchema.index({ email: 1, token: 1 }, { unique: true });

const Token = models?.Token || model<IToken>("Token", TokenSchema);

export default Token;
