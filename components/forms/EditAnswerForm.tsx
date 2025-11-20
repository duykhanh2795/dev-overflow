// "use client";

// import Editor from "@/components/editor";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { EditAnswer } from "@/lib/actions/answer.action";
// import { AnswerSchema } from "@/lib/validation";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { MDXEditorMethods } from "@mdxeditor/editor";
// import { useRouter } from "next/navigation";
// import { useRef } from "react";
// import { useForm } from "react-hook-form";
// import { toast } from "sonner";
// import { z } from "zod";

// export default function EditAnswerForm({ answer }: { answer: Answer }) {
//   const r = useRouter();
//   const editorRef = useRef<MDXEditorMethods>(null);

//   const form = useForm<z.infer<typeof AnswerSchema>>({
//     resolver: zodResolver(AnswerSchema),
//     defaultValues: {
//       content: answer?.content || "",
//     },
//   });
//   const handleEditQuestion = async (data: z.infer<typeof AnswerSchema>) => {
//     const result = await EditAnswer({
//       answerId: answer._id,
//       ...data,
//     });
//     if (result?.success && result?.data) {
//       toast.success("Answer updated successfully");
//       r.back();
//     } else {
//       toast(
//         <span className="text-[18px] font-bold text-red-500">
//           {`Error ${result?.status}`}
//         </span>,
//         {
//           description: (
//             <p className="mt-[3px] text-red-500 font-bold">
//               {result?.error?.message || "Answer update failed"}
//             </p>
//           ),
//           className: "text-red-500",
//           duration: 4000,
//           action: {
//             label: "Close",
//             onClick: () => toast.dismiss(),
//           },
//         }
//       );
//     }
//   };

//   return (
//     <div className="container max-w-4xl py-10">
//       <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
//         Edit your answer
//       </h1>
//       <p className="text-muted-foreground mb-8">
//         Make changes to improve clarity, formatting, or correctness.
//       </p>

//       <Form {...form}>
//         <form
//           onSubmit={form.handleSubmit(handleEditQuestion)}
//           className="space-y-8"
//         >
//           <Card className="shadow-sm border border-border">
//             {/* <CardHeader>
//               <CardTitle className="text-lg font-semibold">
//                 Edit Content
//               </CardTitle>
//             </CardHeader> */}
//             <CardContent className="space-y-4">
//               <Select>
//                 <SelectTrigger className="w-full">
//                   <SelectValue placeholder="Theme" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="light">Light</SelectItem>
//                   <SelectItem value="dark">Dark</SelectItem>
//                   <SelectItem value="system">System</SelectItem>
//                 </SelectContent>
//               </Select>

//               <FormField
//                 control={form.control}
//                 name="content"
//                 render={({ field }) => (
//                   <FormItem className="flex flex-col gap-2">
//                     <FormLabel className="font-medium text-gray-800 dark:text-gray-100">
//                       Content
//                     </FormLabel>
//                     <FormControl>
//                       <Editor
//                         value={field.value}
//                         fieldChange={field.onChange}
//                         editorRef={editorRef}
//                       />
//                     </FormControl>
//                     <FormDescription>
//                       Be clear and concise — improve grammar, fix formatting, or
//                       add detail.
//                     </FormDescription>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </CardContent>
//           </Card>

//           <div className="flex justify-end gap-3">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => r.back()}
//             >
//               Cancel
//             </Button>
//             <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
//               Save edits
//             </Button>
//           </div>
//         </form>
//       </Form>
//     </div>
//   );
// }
"use client";

import ROUTES from "@/app/constants/routes";
import Editor from "@/components/editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EditAnswer } from "@/lib/actions/answer.action";
import { getTimeStamp } from "@/lib/utils";
import { AnswerSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export default function EditAnswerForm({ answer }: { answer: Answer }) {
  const r = useRouter();
  const editorRef = useRef<MDXEditorMethods>(null);

  const [selectedContent, setSelectedContent] = useState(answer?.content || "");

  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      content: selectedContent,
    },
  });
  const handleSelectHistory = (value: string) => {
    if (value === "current") {
      setSelectedContent(answer.content);
      form.setValue("content", answer.content);
      return;
    }

    const selected = answer.editHistory?.find((_, i) => i.toString() === value);
    if (selected) {
      setSelectedContent(selected.content);
      form.setValue("content", selected.content);
    }
  };

  const handleEditAnswer = async (data: z.infer<typeof AnswerSchema>) => {
    const result = await EditAnswer({
      answerId: answer._id,
      ...data,
    });
    if (result?.success && result?.data) {
      toast.success("Answer updated successfully");
      r.back();
    } else {
      toast(
        <span className="text-[18px] font-bold text-red-500">
          {`Error ${result?.status}`}
        </span>,
        {
          description: (
            <p className="mt-[3px] text-red-500 font-bold">
              {result?.error?.message || "Answer update failed"}
            </p>
          ),
          className: "text-red-500",
          duration: 4000,
          action: {
            label: "Close",
            onClick: () => toast.dismiss(),
          },
        }
      );
    }
  };

  return (
    <div className="container max-w-4xl py-10">
      <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">
        Edit your answer
      </h1>
      <p className="text-muted-foreground mb-8">
        Make changes to improve clarity, formatting, or correctness.
      </p>
      <Link
        href={ROUTES.QUESTION(answer.question._id)}
        className="inline-block mb-4"
      >
        <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-2 flex-1">
          {answer.question.title}
        </h3>
      </Link>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleEditAnswer)}
          className="space-y-8"
        >
          <Card className="shadow-sm border border-border">
            <CardContent className="space-y-4">
              <div>
                <FormLabel className="font-medium text-gray-800 dark:text-gray-100">
                  Previous versions
                </FormLabel>
                <Select onValueChange={handleSelectHistory}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select previous version" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Current version</SelectItem>
                    {answer.editHistory?.length
                      ? [...answer.editHistory].reverse().map((h, i) => (
                          <SelectItem key={i} value={i.toString()}>
                            {new Date(h.editedAt).toLocaleString()} -{" "}
                            {getTimeStamp(new Date(h.editedAt))}
                          </SelectItem>
                        ))
                      : null}
                  </SelectContent>
                </Select>
              </div>

              {/* Editor */}
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel className="font-medium text-gray-800 dark:text-gray-100">
                      Content
                    </FormLabel>
                    <FormControl>
                      <Editor
                        key={selectedContent} // ✅ ép re-render khi đổi version
                        value={selectedContent}
                        fieldChange={(val) => {
                          setSelectedContent(val);
                          field.onChange(val);
                        }}
                        editorRef={editorRef}
                      />
                    </FormControl>

                    <FormDescription>
                      Be clear and concise — improve grammar, fix formatting, or
                      add detail.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => r.back()}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Save edits
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
