"use server";

import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { signIn } from "@/auth";
import Account from "@/database/account.model";
import User from "@/database/user.model";

import action from "../handlers/action";
import handleError from "../handlers/error";

import Token from "@/database/token.model";
import { NotFoundError } from "../http-errors";
import { sendPasswordResetEmail, sendVerificationEmail } from "../mail.utils";
import {
  generatePasswordResetToken,
  generateVerificationToken,
} from "../token";
import {
  NewPasswordSchema,
  ResetPasswordSchema,
  SignInSchema,
  SignUpSchema,
} from "../validation";

export async function signUpWithCredentials(
  params: AuthCredentials
): Promise<ActionResponse> {
  const validationResult = await action({ params, schema: SignUpSchema });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { name, username, email, password } = validationResult.params!;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingUser = await User.findOne({ email }).session(session);

    if (existingUser) {
      throw new Error("User already exists");
    }

    const existingUsername = await User.findOne({ username }).session(session);

    if (existingUsername) {
      throw new Error("Username already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const [newUser] = await User.create([{ username, name, email }], {
      session,
    });

    await Account.create(
      [
        {
          userId: newUser._id,
          name,
          provider: "credentials",
          providerAccountId: email,
          password: hashedPassword,
        },
      ],
      { session }
    );

    await session.commitTransaction();

    await signIn("credentials", { email, password, redirect: false });

    return { success: true };
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}
export async function signInWithCredentials(
  params: Pick<AuthCredentials, "email" | "password">
): Promise<ActionResponse> {
  const validationResult = await action({ params, schema: SignInSchema });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { email, password } = validationResult.params!;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new NotFoundError("User not found");
    }

    if (!existingUser.emailVerified) {
      const verificationToken = await generateVerificationToken(
        existingUser.email
      );
      await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token
      );
    }

    const existingAccount = await Account.findOne({
      provider: "credentials",
      providerAccountId: email,
      userId: existingUser._id,
    });
    if (!existingAccount) {
      throw new NotFoundError("Account not found");
    }
    const isValidPassword = await bcrypt.compare(
      password,
      existingAccount.password!
    );
    if (!isValidPassword) {
      throw new Error("Invalid password");
    }
    await signIn("credentials", { email, password, redirect: false });
    return { success: true };
  } catch (error) {
    console.log(error);
    return handleError(error) as ErrorResponse;
  }
}
export async function newVerification(token: string) {
  const existingToken = await Token.findOne({ token });
  if (!existingToken) {
    throw new NotFoundError("Token not found");
  }
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    throw new Error("Token has expired");
  }
  const existingUser = await User.findOne({ email: existingToken.email });
  if (!existingUser) {
    throw new NotFoundError("User not found");
  }
  await User.findByIdAndUpdate(
    existingUser.id,
    {
      emailVerified: new Date(),
      email: existingToken.email,
    },
    { new: true }
  );
  await Token.findByIdAndDelete(existingToken.id);
}
export async function ResetPassword(params: {
  email: string;
}): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: ResetPasswordSchema,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { email } = validationResult.params!;
  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new Error("Email not found");
    }
    const passwordResetToken = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(
      passwordResetToken.email,
      passwordResetToken.token
    );
    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function NewPassword(
  params: { password: string },
  token?: string | null
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: NewPasswordSchema,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { password } = validationResult.params!;
  try {
    const existingToken = await Token.findOne({ token });
    if (!existingToken) {
      throw new NotFoundError("Token not found or invalid");
    }
    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) {
      throw new Error("Token has expired");
    }
    const existingUser = await User.findOne({ email: existingToken.email });
    if (!existingUser) {
      throw new NotFoundError("Email not found");
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const existingAccount = await Account.findOne({
      provider: "credentials",
      userId: existingUser.id,
      providerAccountId: existingUser.email,
    });
    if (!existingAccount) {
      throw new NotFoundError("Account not found");
    }
    await Account.updateOne(
      { _id: existingAccount._id },
      { $set: { password: hashedPassword } }
    );
    await Token.findByIdAndDelete(existingToken.id);
    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
