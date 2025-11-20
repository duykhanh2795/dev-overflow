"use client";
import { newVerification } from "@/lib/actions/auth.action";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { useCallback, useEffect, useState } from "react";

const EmailVerificationForm = ({ token }: { token: string }) => {
  const [message, setMessage] = useState<string | null>(null);
  const onSubmit = useCallback(() => {
    if (!token) {
      setMessage("Invalid or missing token.");
      return;
    }
    newVerification(token);
  }, [token]);
  useEffect(() => {
    onSubmit();
  }, [onSubmit]);
  return (
    <div className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500">
      <CheckCircledIcon className="h-4 w-4" />
      <p>Email Verified</p>
    </div>
  );
};
export default EmailVerificationForm;
