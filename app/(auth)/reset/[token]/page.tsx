"use client";
import AuthForm from "@/components/forms/AuthForm";
import { NewPassword } from "@/lib/actions/auth.action";
import { NewPasswordSchema } from "@/lib/validation";

const Page = async ({ params }: { params: Promise<{ token: string }> }) => {
  const { token } = await params;
  return (
    <div>
      <AuthForm
        formType="NEW_PASSWORD"
        schema={NewPasswordSchema}
        defaultValues={{ password: "" }}
        onSubmit={NewPassword}
        token={token}
      />
    </div>
  );
};

export default Page;
