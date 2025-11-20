// "use client";

// import Image from "next/image";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import React, { useEffect, useRef, useState } from "react";

// import { Input } from "@/components/ui/input";
// import { formUrlQuery, removUrlQueryKeys } from "@/lib/url";
// import GlobalResult from "../GlobalResult";



// const GlobalSearch = () => {
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();

//   const query = searchParams.get("global");

//   const [search, setSearch] = useState(query || "");
//   const [isOpen, setIsOpen] = useState(query || false);
//   const searchContainerRef = useRef(null);

//   useEffect(() => {
//     const handleOutsideClick = (event: MouseEvent) => {
//       if (
//         searchContainerRef.current &&
//         // @ts-expect-error Property 'contains' does not exist on type 'EventTarget | null'.
//         !searchContainerRef.current?.contains(event.target)
//       ) {
//         setIsOpen(false);
//         setSearch("");
//       }
//     };

//     document.addEventListener("click", handleOutsideClick);

//     return () => {
//       document.removeEventListener("click", handleOutsideClick);
//     };
//   }, []);

//   useEffect(() => {
//     const delayDebounceFn = setTimeout(() => {
//       if (search) {
//         const newUrl = formUrlQuery({
//           params: searchParams.toString(),
//           key: "global",
//           value: search,
//         });

//         router.push(newUrl, { scroll: false });
//       } else {
//         if (query) {
//           const newUrl = removUrlQueryKeys({
//             params: searchParams.toString(),
//             keys: ["global", "type"],
//           });

//           router.push(newUrl, { scroll: false });
//         }
//       }
//     }, 300);

//     return () => clearTimeout(delayDebounceFn);
//   }, [search, pathname, router, searchParams, query]);

//   return (
//     <div
//       className="relative w-full max-w-[600px] max-lg:hidden"
//       ref={searchContainerRef}
//     >
//       <div className="background-light800_darkgradient bg-transparent relative flex min-h-[40px] border-[1px] border-[#a7a7a7] grow items-center gap-1 rounded-full px-4">
//         <Image
//           src="/icons/search.svg"
//           alt="search"
//           width={17}
//           height={17}
//           className="cursor-pointer"
//         />

//         <Input
//           type="text"
//           placeholder="Search anything globally..."
//           value={search}
//           onChange={(e) => {
//             setSearch(e.target.value);
//             if (!isOpen) setIsOpen(true);
//             if (e.target.value === "" && isOpen) setIsOpen(false);
//           }}
//           className="paragraph-regular no-focus placeholder text-dark400_light700 border-none shadow-none outline-none"
//         />
//       </div>
//       {isOpen && <GlobalResult />}
//     </div>
//   );
// };

// export default GlobalSearch;
"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { formUrlQuery, removUrlQueryKeys } from "@/lib/url";
import GlobalResult from "../GlobalResult";

const GlobalSearch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get("global");

  const [search, setSearch] = useState(query || "");
  const [isOpen, setIsOpen] = useState(Boolean(query));
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  //
  // ✅ 1. Bắt Ctrl + K để mở search
  //
  // useEffect(() => {
  //   const handleHotKey = (e: KeyboardEvent) => {
  //     if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
  //       e.preventDefault();
  //       setIsOpen(true);

  //       // Focus input
  //       setTimeout(() => {
  //         inputRef.current?.focus();
  //       }, 10);
  //     }
  //   };

  //   window.addEventListener("keydown", handleHotKey);
  //   return () => window.removeEventListener("keydown", handleHotKey);
  // }, []);

  // //
  // // Đóng khi click ra ngoài
  //
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  //
  // Debounce URL update
  //
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "global",
          value: search,
        });

        router.push(newUrl, { scroll: false });
      } else {
        if (query) {
          const newUrl = removUrlQueryKeys({
            params: searchParams.toString(),
            keys: ["global", "type"],
          });

          router.push(newUrl, { scroll: false });
        }
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, pathname, router, searchParams, query]);

  return (
    <div
      className="relative w-full max-w-[600px] max-lg:hidden"
      ref={searchContainerRef}
    >
      <div className="background-light800_darkgradient bg-transparent relative flex min-h-[40px] border-[1px] border-[#a7a7a7] grow items-center gap-1 rounded-full px-4">
        <Image
          src="/icons/search.svg"
          alt="search"
          width={17}
          height={17}
          className="cursor-pointer"
        />

        <Input
          ref={inputRef}
          type="text"
          placeholder="Search anything globally..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!isOpen) setIsOpen(true);
            if (e.target.value === "" && isOpen) setIsOpen(false);
          }}
          className="paragraph-regular no-focus placeholder text-dark400_light700 border-none shadow-none outline-none"
        />
      </div>

      {isOpen && <GlobalResult />}
    </div>
  );
};

export default GlobalSearch;
