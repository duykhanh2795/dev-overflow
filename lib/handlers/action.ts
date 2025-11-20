"use server";

import { auth } from "@/auth";
import { Session } from "next-auth";
import { ZodError, ZodObject, ZodRawShape } from "zod";
import { UnauthorizedError, ValidationError } from "../http-errors";
import dbConnect from "../mongoose";

type ActionOptions<T> = {
  params?: T;
  schema?: ZodObject<ZodRawShape>;
  authorize?: boolean;
};
export default async function action<T>({
  params,
  schema,
  authorize = false,
}: ActionOptions<T>) {
  if (schema && params) {
    try {
      schema.parse(params);
    } catch (error) {
      console.log("Validation error:", error);
      if (error instanceof ZodError) {
        return new ValidationError(
          error.flatten().fieldErrors as Record<string, string[]>
        );
      } else {
        return new Error("Schema validation failed");
      }
    }
  }
  let session: Session | null = null;

  if (authorize) {
    session = await auth();
    if (!session) {
      return new UnauthorizedError("User is not authenticated");
    }
  }

  await dbConnect();
    return { params, session };
}
