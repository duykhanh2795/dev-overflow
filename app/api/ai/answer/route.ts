import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import { AIAnswerSchema } from "@/lib/validation";
import { NextResponse } from "next/server";
// const path = require("path");

// const nitPath = path.join(
//   "dancsn",
//   "node_modules",
//   "@heyputer",
//   "puter.js",
//   "src",
//   "nit.cjs"
// );

// console.log("Đường dẫn tuyệt đối của nit.cjs:", nitPath);
import { init } from "@/lib/puter/init.cjs";

export async function POST(req: Request) {
  console.log("pwd", process.cwd());
  const { question, content } = await req.json();
  const validateData = AIAnswerSchema.safeParse({ question, content });
  if (!validateData.success)
    throw new ValidationError(validateData.error.flatten().fieldErrors);

  try {
    const puter = await init(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0IjoicyIsInYiOiIwLjAuMCIsInUiOiJFRXcxWmZhNlM3ZTl5ZGtLU2I3cy9BPT0iLCJ1dSI6IlN0ZC8xV2hpVEFPRjlDUHlkMXdITmc9PSIsImlhdCI6MTc2MDYwNjcyN30.RMzHvupjJkC7hs0kD3Vnb2uat9ps08IFABdk3bO8DcI"
    );
    const question = "What is the difference between SQL and NoSQL databases?";
    const content =
      "SQL databases are relational, structured, and use tables with predefined schemas. Examples include MySQL and PostgreSQL. NoSQL databases, like MongoDB and Firebase, are flexible, schema-less, and better suited for handling unstructured data and high scalability.";
    let AIanwer;
    await puter.ai
      .chat("What color was Napoleon's white horse?")
      .then((response: string) => {
        AIanwer = response;
      });
    console.log("AIanwer:", AIanwer);
    return NextResponse.json({ success: true, data: AIanwer }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
