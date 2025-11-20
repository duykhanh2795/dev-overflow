import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validation";
import { NextResponse } from "next/server";
import z from "zod";

export async function GET() {
  try {
    await dbConnect();
    const users = await User.find();
    return NextResponse.json(
      { success: true, data: users },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const validatedData = await UserSchema.safeParse(body);
    if (!validatedData.success) {
      throw new ValidationError(
        z.treeifyError(validatedData.error) as any,
      );
    }
    const { username, email } = validatedData.data;
    const existingEmail = await User.findOne({ email });
    const existingUsername = await User.findOne({
      username,
    });
    if (existingEmail) {
      throw new Error("Email already exists");
    }
    if (existingUsername) {
      throw new Error("Username already exists");
    }
    const newUser = await User.create(validatedData.data);
    return NextResponse.json(
      { success: true, data: newUser },
      { status: 201 },
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
