import Account from "@/database/account.model";
import handleError from "@/lib/handlers/error";
import {
  NotFoundError,
  ValidationError,
} from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validation";
import { NextResponse } from "next/server";
import z from "zod";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) {
    throw new NotFoundError("Account");
  }
  try {
    await dbConnect();

    const account = await Account.findById(id);
    if (!account) {
      throw new NotFoundError("Account");
    }
    return NextResponse.json(
      { success: true, data: account },
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
    throw new NotFoundError("Account");
  }
  try {
    await dbConnect();

    const account = await Account.findByIdAndDelete(id);
    if (!account) {
      throw new NotFoundError("Account");
    }
    return NextResponse.json(
      { success: true, data: account },
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
    throw new NotFoundError("Account");
  }
  try {
    await dbConnect();

    const body = await request.json();
    const validatedData =
      AccountSchema.partial().safeParse(body);
    if (!validatedData.success) {
      throw new ValidationError(
        z.treeifyError(validatedData.error) as any,
      );
    }

    const account = await Account.findByIdAndUpdate(
      id,
      body,
      {
        new: true,
      },
    );
    if (!account) {
      throw new NotFoundError("Account");
    }
    return NextResponse.json(
      { success: true, data: account },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
