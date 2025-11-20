import { NextResponse } from "next/server";
import z, { ZodError } from "zod";
import { RequestError, ValidationError } from "../http-errors";

export type RespondType = "api" | "server";

const formatRespond = (
  respondType: RespondType,
  status: number,
  message: string,
  errors?: Record<string, string[]> | undefined
) => {
  const respondContent = {
    success: false,
    error: {
      message,
      details: errors,
    },
  };
  return respondType === "api"
    ? NextResponse.json(respondContent, {
        status,
      })
    : {
        status,
        ...respondContent,
      };
};
const handleError = (error: unknown, respondType: RespondType = "server") => {
  if (error instanceof RequestError) {
    return formatRespond(
      respondType,
      error.statusCode,
      error.message,
      error.errors
    );
  }
  if (error instanceof ZodError) {
    const validationError = new ValidationError(
      z.treeifyError(error) as Record<string, string[]>
    );
    return formatRespond(
      respondType,
      validationError.statusCode,
      validationError.message,
      validationError.errors
    );
  }
  if (error instanceof Error) {
    return formatRespond(respondType, 500, error.message);
  }
  return formatRespond(respondType, 500, "Unknown Error");
};

export default handleError;
