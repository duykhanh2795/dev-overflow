"use client";
import { formUrlQuery, removUrlQueryKeys } from "@/lib/url";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";

interface SearchProps {
  route: string;
  imgSrc: string;
  placeholder: string;
  otherClasses?: string;
  iconPosition?: "left" | "right";
}

export default function LocalSearch({
  route,
  imgSrc,
  placeholder,
  otherClasses,
  iconPosition = "left",
}: SearchProps) {
  const r = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "query",
          value: searchQuery,
        });
        r.push(newUrl, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = removUrlQueryKeys({
            params: searchParams.toString(),
            keys: ["query"],
          });
          r.push(newUrl, { scroll: false });
        }
      }
    }, 1700);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, route, searchParams, pathname]);
  return (
    <div
      className={`background-light800_darkgradient rounded-2 flex min-h-[56px] grow items-center gap-4 border-[1px] border-[#ededed] dark:border-[#4b4b4b] bg-white px-4 ${otherClasses}`}
    >
      {iconPosition === "left" && (
        <Image
          src={imgSrc}
          width={20}
          height={20}
          alt="Search"
          className="cursor-pointer"
        />
      )}
      <Input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="paragraph-regular no-focus text-dark400_light700 border-none shadow-none outline-none"
      ></Input>
      {iconPosition === "right" && (
        <Image
          src={imgSrc}
          width={20}
          height={20}
          alt="Search"
          className="cursor-pointer"
        />
      )}
    </div>
  );
}
