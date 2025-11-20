"use client";
import AuthForm from "@/components/forms/AuthForm";
import { ResetPassword } from "@/lib/actions/auth.action";
import { ResetPasswordSchema } from "@/lib/validation";

const Reset = () => {
  return (
    <div>
      <AuthForm
        formType="RESET_PASSWORD"
        schema={ResetPasswordSchema}
        defaultValues={{ email: "" }}
        onSubmit={ResetPassword}
      />
    </div>
  );
};

export default Reset;
