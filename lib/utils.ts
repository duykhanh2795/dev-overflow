import { BADGE_CRITERIA } from "@/app/constants";
import { techMap } from "@/app/constants/techMap";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDeviconClassName(techName: string) {
  const normalizedTechName = techName.replace(/[ .]/g, "").toLowerCase();
  return techMap[normalizedTechName]
    ? `${techMap[normalizedTechName]} colored`
    : "devicon-devicon-plain";
}
export function getTechDescription(techName: string): string {
  const normalizedTech = techName.replace(/[ .]/g, "").toLowerCase();

  // Mapping technology names to descriptions
  const techDescriptionMap: { [key: string]: string } = {
    javascript:
      "JavaScript is a powerful language for building dynamic, interactive, and modern web applications.",
    typescript:
      "TypeScript adds strong typing to JavaScript, making it great for scalable and maintainable applications.",
    react:
      "React is a popular library for building fast, component-based user interfaces and web applications.",
    nextjs:
      "Next.js is a React framework for building fast, SEO-friendly, and production-grade web applications.",
    nodejs:
      "Node.js is a runtime for building fast and scalable server-side applications using JavaScript.",
    python:
      "Python is a beginner-friendly language known for its versatility and simplicity in various fields.",
    java: "Java is a versatile, cross-platform language widely used in enterprise and Android development.",
    "c++":
      "C++ is a high-performance language ideal for system programming, games, and large-scale applications.",
    git: "Git is a version control system that helps developers track changes and collaborate on code efficiently.",
    docker:
      "Docker simplifies app deployment by containerizing environments, ensuring consistency across platforms.",
    mongodb:
      "MongoDB is a flexible NoSQL database ideal for handling unstructured data and scalable applications.",
    mysql:
      "MySQL is a popular open-source relational database management system known for its stability and performance.",
    postgresql:
      "PostgreSQL is a powerful open-source SQL database known for its scalability and robustness.",
    aws: "Amazon Web Services (AWS) is a cloud computing platform that offers a wide range of services for building, deploying, and managing web and mobile applications.",
  };

  return (
    techDescriptionMap[normalizedTech] ||
    `${techName} is a technology or tool widely used in software development, providing valuable features and capabilities.`
  );
}
export function formatNumber(number: number) {
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + "M";
  } else if (number >= 1000) {
    return (number / 1000).toFixed(1) + "K";
  } else {
    return number.toString();
  }
}

export const getTimeStamp = (createdAt: Date): string => {
  const date = new Date(createdAt);
  const now = new Date();

  const diffMilliseconds = now.getTime() - date.getTime();
  const diffSeconds = Math.round(diffMilliseconds / 1000);
  if (diffSeconds < 60) {
    return `${diffSeconds} seconds ago`;
  }

  const diffMinutes = Math.round(diffSeconds / 60);
  if (diffMinutes < 60) {
    return `${diffMinutes} mins ago`;
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hours ago`;
  }

  const diffDays = Math.round(diffHours / 24);

  return `${diffDays} days ago`;
};
export const createdDate = (createdAt: Date) =>
  new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export const createdTime = (createdAt: Date) =>
  new Date(createdAt).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
export function assignBadges(params: {
  criteria: {
    type: keyof typeof BADGE_CRITERIA;
    count: number;
  }[];
}) {
  const badgeCounts: Badges = {
    GOLD: 0,
    SILVER: 0,
    BRONZE: 0,
  };

  const { criteria } = params;

  criteria.forEach((item) => {
    const { type, count } = item;
    const badgeLevels = BADGE_CRITERIA[type];

    Object.keys(badgeLevels).forEach((level) => {
      if (count >= badgeLevels[level as keyof typeof badgeLevels]) {
        badgeCounts[level as keyof Badges] += 1;
      }
    });
  });

  return badgeCounts;
}

// "use client";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormMessage,
// } from "@/components/ui/form";
// import { createAnswer } from "@/lib/actions/answer.action";
// import { AnswerSchema } from "@/lib/validation";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { MDXEditorMethods } from "@mdxeditor/editor";
// import { useSession } from "next-auth/react";
// import dynamic from "next/dynamic";
// import Image from "next/image";
// import Script from "next/script";
// import { useRef, useState } from "react";
// import { SubmitHandler, useForm } from "react-hook-form";
// import { toast } from "sonner";
// import { z } from "zod";
// import { Button } from "../ui/button";
// import { ReloadIcon } from "../ui/icons/oi-reload";

// const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

// const AnswerForm = ({
//   questionId,
//   title,
//   content,
// }: {
//   questionId: string;
//   title: string;
//   content: string;
// }) => {
//   const session = useSession();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isAISubmitting, setIsAISubmitting] = useState(false);

//   const editorRef = useRef<MDXEditorMethods>(null);

//   const form = useForm<z.infer<typeof AnswerSchema>>({
//     resolver: zodResolver(AnswerSchema),
//     defaultValues: { content: "" },
//   });

//   const handleSubmit: SubmitHandler<z.infer<typeof AnswerSchema>> = async (
//     formData
//   ) => {
//     console.log("questionId:", typeof questionId);
//     console.log("data:", formData);
//     const { success, data, error } = await createAnswer({
//       questionId: questionId,
//       content: formData.content,
//     });
//     if (success && data) {
//       console.log("Answer created:", data);
//       form.reset();
//       toast.success("Answer submitted successfully");
//       if (editorRef.current) {
//         editorRef.current.setMarkdown("");
//       }
//     } else {
//       toast.error(error?.message || "Failed to submit answer", error?.details);
//     }
//   };
//   // const generateAIAnswer = async () => {
//   //   if (session.status !== "authenticated")
//   //     return toast.error("Please log in to use this feature");
//   //   setIsAISubmitting(true);
//   //   try {
//   //     const { success, data, error } = await api.ai.getAnswer(title, content);
//   //     <Script></Script>;

//   //     if (!success) {
//   //       toast.error(
//   //         error instanceof Error ? error?.message : "AI generate answer error"
//   //       );
//   //     }

//   //     const formattedAnswer = data.replace(/<br>/g, " ").toString().trim();

//   //     if (editorRef.current) {
//   //       editorRef.current.setMarkdown(formattedAnswer);

//   //       form.setValue("content", formattedAnswer);
//   //       form.trigger("content");
//   //     }
//   const generateAIAnswer = async () => {
//     if (session.status !== "authenticated")
//       return toast.error("Please log in to use this feature");

//     setIsAISubmitting(true);

//     try {
//       // Đợi SDK Puter load
//       // while (typeof window.puter === "undefined") {
//       //   await new Promise((r) => setTimeout(r, 100));
//       // }
//       <script src="https://js.puter.com/v2/"></script>;
//       <script>
//         text = puter.ai.chat(`Why did the chicken cross the
//         road?`).then(puter.print);
//       </script>;
//       // const aiResponse = await window.puter.ai.chat([
//       //   {
//       //     role: "system",
//       //     content:
//       //       "You are a helpful assistant that provides detailed answers in markdown format.",
//       //   },
//       //   {
//       //     role: "user",
//       //     content: `Generate a detailed markdown answer for: "${title}". Context: ${content}`,
//       //   },
//       // ]);
//       // console.log("AI Response:", aiResponse);
//       const markdownAnswer = aiResponse.message?.content || "";

//       if (editorRef.current) {
//         editorRef.current.setMarkdown(markdownAnswer);
//         form.setValue("content", markdownAnswer);
//         form.trigger("content");
//       }

//       toast.success("AI answer generated!");
//     } catch (error) {
//       toast.error(
//         error instanceof Error ? error?.message : "AI generate answer error"
//       );
//     }
//   };
//   return (
//     <div>
//       <Script
//         src="https://js.puter.com/v2/puter.js"
//         strategy="afterInteractive"
//       />
//       <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
//         <h4 className="paragraph-semibold text-dark400_light800">
//           Write your answer here
//         </h4>
//         <Button
//           className="btn light-border-2 gap-1.5 rounded-md border px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500"
//           disabled={isAISubmitting}
//           onClick={generateAIAnswer}
//         >
//           {isAISubmitting ? (
//             <>
//               <ReloadIcon className="mr-2 size-4 animate-spin" />
//               Generating...
//             </>
//           ) : (
//             <>
//               <Image
//                 src="/icons/stars.svg"
//                 alt="Generate AI Answer"
//                 width={12}
//                 height={12}
//                 className="object-contain"
//               />
//               Generate AI Answer
//             </>
//           )}
//         </Button>
//       </div>
//       <Form {...form}>
//         <form
//           onSubmit={form.handleSubmit(handleSubmit)}
//           className="mt-6 flex w-full flex-col gap-10"
//         >
//           <FormField
//             control={form.control}
//             name="content"
//             render={({ field }) => (
//               <FormItem className="flex w-full flex-col gap-3">
//                 <FormControl className="mt-3.5">
//                   <Editor
//                     value={field.value}
//                     editorRef={editorRef}
//                     fieldChange={field.onChange}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <div className="flex justify-end">
//             <Button className="primary-gradient" type="submit">
//               {isSubmitting ? "Submitting..." : "Submit"}
//             </Button>
//           </div>
//         </form>
//       </Form>
//     </div>
//   );
// };

// export default AnswerForm;
// const [socket, setSocket] = useState<Socket | null>(null);
// useEffect(() => {
//   setSocket(io("http://localhost:3001"));
// }, []);
// const userName = session.data?.user?.name || "Guest";
// useEffect(() => {
//   if (socket) socket.emit("newUser", userName);
// }, [socket, userName]);
// const [notifications, setNotifications] = useState<any[]>([]);
// useEffect(() => {
//   socket?.on("getNotification", (data) => {
//     setNotifications((prev) => [...prev, data]);
//   });
// }, [socket]);
// console.log("Notifications:", notifications);
// socket?.emit("sendNotification", {
//   senderName: userName,
//   receiverName: authorName,
//   type: "answer",
// });
