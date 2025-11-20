import ROUTES from "@/app/constants/routes";
import { auth, signOut } from "@/auth";
import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import NavLinks from "./navbar/NavLinks";

const LeftSidebar = async () => {
  const session = await auth();
  const userId = session?.user?.id;
  const btnClass =
    "w-full dark:border-dark700 bg-transparent text-dark400_light900 border dark:border-[#2e2c2c]  py-5 rounded-[3px] border-[#cecece]";
  return (
    <section className="custom-scrollbar background-light_dark light-border shadow-light-300 sticky top-0 left-0 flex h-screen flex-col justify-between overflow-y-auto border-r border-[#ebeff5] p-6 pt-28 lg:w-[266px] dark:shadow-none">
      <div className="flex flex-1 flex-col gap-5">
        <NavLinks isMobileNav={false} userId={userId} />
      </div>

      <div className="mb-1.5 flex flex-col gap-2 border-[#bbbbbb] dark:border-[#515151]">
        {userId ? (
          <>
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <Button
                type="submit"
                className="bg-transparent !w-fit"
                variant={"ghost"}
              >
                <LogOut className="text-black dark:text-white " />
                <span className="text-dark400_light900 max-lg:hidden">
                  Log out
                </span>
              </Button>
            </form>
          </>
        ) : (
          <>
            {" "}
            <Button asChild className={`${btnClass} mt-9`} variant={"outline"}>
              <Link href={ROUTES.SIGN_IN}>
                <Image
                  src="/icons/account.svg"
                  width={20}
                  height={20}
                  alt="Sign In"
                  className="invert-colors"
                />{" "}
                <span>Sign In</span>
              </Link>
            </Button>
            <Button asChild className={btnClass} variant={"outline"}>
              <Link href={ROUTES.SIGN_UP}>
                <Image
                  src="/icons/sign-up.svg"
                  width={20}
                  height={20}
                  alt="Sign In"
                  className="invert-colors"
                />
                <span>Sign Up</span>
              </Link>
            </Button>
          </>
        )}
      </div>
    </section>
  );
};

export default LeftSidebar;
