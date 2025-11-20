export const dynamic = "force-dynamic";
import { auth } from "@/auth";
import { NotificationBell } from "@/components/cards/NotificationCard";
import GlobalSearch from "@/components/search/GlobalSearch";
import UserAvatar from "@/components/ui/UserAvatar";
import { getUserById } from "@/lib/actions/user.action";
import Image from "next/image";
import Link from "next/link";
import Theme from "./Theme";

export default async function Navbar() {
  const session = await auth();
  const result = await getUserById(session?.user?.id as string);
  const { user } = result.data! || {};
  return (
    <nav className="flex-between border-b background-light_dark dark:shadown-none fixed z-50 w-full p-6 sm:px-12 py-3">
      <Link href={"/"} className="flex-between">
        <Image
          src="/images/output-onlinepngtools.png"
          height={50}
          width={50}
          alt="Dev forum logo"
        />
        <p className="h2-bold font-space-grotesk text-dark-100 dark:text-light-900 max-sm:hidden">
          Dev
          <span className="text-primary-500">Forum</span>
        </p>
      </Link>
      <GlobalSearch />
      <div className="flex-between gap-5">
        <Theme />
        {session?.user?.id && (
          <>
            <NotificationBell />
            <UserAvatar
              id={session.user.id}
              name={session.user.name!}
              img={user.image!}
            />
          </>
        )}
      </div>
    </nav>
  );
}
