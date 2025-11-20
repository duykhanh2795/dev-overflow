import EmailVerificationForm from "@/components/forms/EmailVerification";

const VerifyEmail = async ({
  params,
}: {
  params: Promise<{ token: string }>;
}) => {
  const { token } = await params;
  return <EmailVerificationForm token={token} />;
};

export default VerifyEmail;
