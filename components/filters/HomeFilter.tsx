// "use client";
// import { formUrlQuery, removUrlQueryKeys } from "@/lib/url";
// import { cn } from "@/lib/utils";
// import Image from "next/image";
// import {
//   useRouter,
//   useSearchParams,
// } from "next/navigation";
// import { useState } from "react";
// import SortDropdownMenu from "../menu/sort-dropdown-menu";
// import { Button } from "../ui/button";
// import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

// const HomeFilter = () => {
//   const filters = [
//     {
//       name: "Newest",
//       value: "newest",
//       icon: "/icons/newest.svg",
//     },
//     {
//       name: "Active",
//       value: "active",
//       icon: "/icons/newest.svg",
//     },
//     {
//       name: "Unanswered",
//       value: "unanswered",
//       icon: "/icons/newest.svg",
//     },
//     {
//       name: "Popular",
//       value: "popular",
//       icon: "/icons/newest.svg",
//     },
//   ];
//   // const filters = [
//   //   { name: "div", value: "Div" },
//   //   { name: "var", value: "Var" },
//   // ];

//   const r = useRouter();
//   const searchParams = useSearchParams();
//   const filterParams = searchParams.get("filter") || "";
//   const [isActive, setIsActive] = useState(
//     filterParams || "",
//   );

//   const handleTypeChange = (filter: string) => {
//     let newUrl = "";
//     if (filter === isActive) {
//       setIsActive("");
//       newUrl = removUrlQueryKeys({
//         params: searchParams.toString(),
//         keys: ["filter"],
//       });

//       r.push(newUrl, { scroll: false });
//     } else {
//       setIsActive(filter);
//       newUrl = formUrlQuery({
//         params: searchParams.toString(),
//         key: "filter",
//         value: filter.toLowerCase(),
//       });

//       r.push(newUrl, { scroll: false });
//     }
//   };

//   return (
//     <div className="mt-10 flex w-full items-center">
//       <div className="rounded-1.5 flex min-w-48 flex-wrap gap-3 !bg-[#fafafb] dark:!bg-[#1e1f21]">
//         <Tabs
//           value={isActive || undefined}
//           onValueChange={handleTypeChange}
//         >
//           <TabsList className="grid min-h-fit grid-cols-4 !bg-[#fafafb] dark:!bg-[#1e1f21]">
//             {filters.map((filter) => (
//               <TabsTrigger
//                 key={filter.name}
//                 value={filter.value}
//                 className={cn(
//                   isActive === filter.value
//                     ? "text-primary-500 dark:!text-primary-500 dark:!bg-[#121212]"
//                     : "bg-light-800 text-[#24344e] dark:bg-[#1e1f21] dark:text-[#e3eeff]",
//                   "flex items-center gap-2 !border-transparent capitalize",
//                 )}
//               >
//                 <Image
//                   src={filter.icon}
//                   alt={filter.name}
//                   width={24}
//                   height={24}
//                   className="dark:invert"
//                 />
//                 {filter.value}
//               </TabsTrigger>
//             ))}
//           </TabsList>
//         </Tabs>
//       </div>
//       <SortDropdownMenu>
//         <Button className="text-dark500_light500 hover:bg-light-800 ml-auto flex items-center rounded-[4px] border bg-transparent px-5 shadow-none outline-none dark:border-2 dark:text-[#e3eeff] dark:hover:bg-[#1e1f21]">
//           <Image
//             src="/icons/sort.svg"
//             alt="Sort"
//             width={20}
//             height={20}
//           />
//           <p>Sort</p>
//         </Button>
//       </SortDropdownMenu>
//     </div>
//   );
// };

// export default HomeFilter;
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { formUrlQuery, removUrlQueryKeys } from "@/lib/url";
import { cn } from "@/lib/utils";

import { Button } from "../ui/button";

const filters = [
  { name: "Newest", value: "newest" },
  { name: "Popular", value: "popular" },
  { name: "Unanswered", value: "unanswered" },
  { name: "Recommeded", value: "recommended" },
];

const HomeFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterParams = searchParams.get("filter");
  const [active, setActive] = useState(filterParams || "");

  const handleTypeClick = (filter: string) => {
    let newUrl = "";

    if (filter === active) {
      setActive("");

      newUrl = removUrlQueryKeys({
        params: searchParams.toString(),
        keys: ["filter"],
      });
    } else {
      setActive(filter);

      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "filter",
        value: filter.toLowerCase(),
      });
    }

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="mt-10 hidden flex-wrap gap-3 sm:flex">
      {filters.map((filter) => (
        <Button
          key={filter.name}
          className={cn(
            active === filter.value
              ? "bg-primary-100 text-primary-500 hover:bg-primary-100 dark:bg-dark-400 dark:text-primary-500 dark:hover:bg-dark-400"
              : "bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300"
          )}
          onClick={() => handleTypeClick(filter.value)}
        >
          {filter.name}
        </Button>
      ))}
    </div>
  );
};

export default HomeFilter;
