import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import {
  NotFoundError,
  ValidationError,
} from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validation";
import { NextResponse } from "next/server";
import z from "zod";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) {
    throw new NotFoundError("User");
  }
  try {
    await dbConnect();

    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError("User");
    }
    return NextResponse.json(
      { success: true, data: user },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) {
    throw new NotFoundError("User");
  }
  try {
    await dbConnect();

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new NotFoundError("User");
    }
    return NextResponse.json(
      { success: true, data: user },
      { status: 204 },
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) {
    throw new NotFoundError("User");
  }
  try {
    await dbConnect();

    const body = await request.json();
    const validatedData = UserSchema.partial().safeParse(body);
    if (!validatedData.success) {
      throw new ValidationError(
        z.treeifyError(validatedData.error) as any,
      );
    }

    const user = await User.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (!user) {
      throw new NotFoundError("User");
    }
    return NextResponse.json(
      { success: true, data: user },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
