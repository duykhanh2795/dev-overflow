import { ValidationError } from "@/lib/http-errors";
import { sendMail } from "@/lib/mail.utils";
import { EmailSchema } from "@/lib/validation";
import { NextResponse } from "next/server";
import z from "zod";

export async function POST(request: Request) {
  try {
    const mailOptions = await request.json();
    const validatedData = EmailSchema.safeParse(mailOptions);
    if (!validatedData.success) {
      throw new ValidationError(z.treeifyError(validatedData.error) as any);
    }
    await sendMail(mailOptions);
    // const success =
    //   Array.isArray(result.accepted) &&
    //   result.accepted.length > 0 &&
    //   (!result.rejected || result.rejected.length === 0) &&
    //   result.response?.includes("250");

    return NextResponse.json(
      {
        success: true,
        message: "Email sent successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
