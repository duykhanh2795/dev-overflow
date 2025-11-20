import Token from "@/database/token.model";
import { v4 as uuidv4 } from "uuid";

export const getVerificationTokenByToken = async (
  type: "token" | "email",
  value: string
) => {
  try {
    const verificationToken = await Token.findOne({ [type]: value });
    return verificationToken;
  } catch {
    return null;
  }
};
export const generateVerificationToken = async (email: string) => {
  const token = await uuidv4();
  const expires = new Date(Date.now() + 1000 * 60 * 60);

  const existingToken = await Token.findOne({ email });
  if (existingToken) {
    await Token.findByIdAndDelete(existingToken.id);
  }
  const verificationToken = await Token.create({
    email,
    token,
    expires,
  });
  return verificationToken;
};
export const generatePasswordResetToken = async (email: string) => {
  const token = await uuidv4();
  const expires = new Date(Date.now() + 1000 * 60 * 30);
  const existingToken = await Token.findOne({ email });
  if (existingToken) {
    await Token.findByIdAndDelete(existingToken.id);
  }
  const passwordResetToken = await Token.create({
    email,
    token,
    expires,
  });
  return passwordResetToken;
};
