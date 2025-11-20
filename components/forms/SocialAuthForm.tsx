"use client";
import { CircleX } from "lucide-react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";

const SocialAuthForm = () => {
    const pathname = usePathname();
  if (pathname !== "/sign-in" && pathname !== "/sign-up") return null;
  const btnClass =
    "bg-transparent border hover:bg-[#dfdfdf] dark:hover:bg-[#302e2e] border-[#e5e5e5] body-medium text-dark200_light800 min-h-12 flex-1 rounded-[4px] px-4 py-3.5";

  const handleSignIn = async (
    provider: "github" | "google",
  ) => {
    try {
      await signIn(
        provider,
        { callbackUrl: "/" },
        { redirect: false },
      );
    } catch (error) {
      toast(
        <span className="text-[18px] font-bold text-red-500">
          <CircleX className="mr-2 inline-block" /> Error
          Sign in
        </span>,
        {
          description: (
            <p className="mt-[3px]">Sign in failed</p>
          ),
          className: "text-red-500",
          duration: 4000,
          action: {
            label: "Close",
            onClick: () => toast.dismiss(),
          },
        },
      );
    }
  };
  return (
    <div className="mt-7 flex flex-wrap gap-2.5">
      <Button
        className={btnClass}
        onClick={() => handleSignIn("github")}
      >
        <Image
          className="invert-colors mr-2.5 object-contain"
          src={"/icons/github.svg"}
          height={20}
          width={20}
          alt="Github Logo"
        />
        <span>Sign in with Github</span>
      </Button>
      <Button
        className={btnClass}
        onClick={() => handleSignIn("google")}
      >
        <Image
          className="mr-2.5 object-contain"
          src={"/icons/google.svg"}
          height={20}
          width={20}
          alt="Google Logo"
        />
        <span>Sign in with Google</span>
      </Button>
    </div>
  );
};
export default SocialAuthForm;
