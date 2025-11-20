"use client";
import { sidebarLinks } from "@/app/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
const NavLinks = ({
  isMobileNav = false,
  userId,
}: {
  isMobileNav?: boolean;
  userId?: string;
}) => {
  const pathname = usePathname();
  return (
    <>
      {sidebarLinks.map((link, i) => {
        const isActive =
          (pathname.includes(link.route) && link.route.length > 1) ||
          pathname == link.route;

        if (link.route === "/profile") {
          if (userId) link.route = `/profile/${userId}`;
          else return null;
        }
        return (
          <Link
            href={link.route}
            key={i}
            className={cn(
              isActive
                ? "primary-gradient rounded-1.5 !bg-[#ecf1f9]dark:bg-[#2d3644]"
                : "text-dark300_light900",
              "hover:bg-light200_dark800 flex items-center justify-start gap-4 p-4 h-[45px] transition-all duration-200 ease-in-out"
            )}
          >
            <Image
              src={link.imgURL}
              height={20}
              width={20}
              alt={link.label}
              className={cn({ "invert-colors": !isActive }, "text-[#89b5fa]")}
            />
            <p>{link.label}</p>
          </Link>
        );
      })}
    </>
  );
};

export default NavLinks;
