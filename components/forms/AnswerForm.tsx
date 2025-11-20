"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useSocket } from "@/context/Socket";
import { createAnswer } from "@/lib/actions/answer.action";
import { createNotification } from "@/lib/actions/notification.action";
import { AnswerSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import { ReloadIcon } from "../ui/icons/oi-reload";
const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

const AnswerForm = ({
  questionId,
  title,
  content,
  authorName,
  authorId,
}: {
  questionId: string;
  title: string;
  content: string;
  authorName: string;
  authorId: string;
}) => {
  const session = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAISubmitting, setIsAISubmitting] = useState(false);
  const editorRef = useRef<MDXEditorMethods>(null);

  const { socket } = useSocket();

  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: { content: "" },
  });

  useEffect(() => {
    if (!document.querySelector('script[src="https://js.puter.com/v2/"]')) {
      const script = document.createElement("script");
      script.src = "https://js.puter.com/v2/";
      script.async = true;
      script.onload = () => console.log("Puter script loaded!");
      document.body.appendChild(script);
    } else {
      console.log("Puter script already loaded");
    }
  }, []);
  const handleSubmit: SubmitHandler<z.infer<typeof AnswerSchema>> = async (
    formData
  ) => {
    setIsSubmitting(true);

    try {
      const { success, data, error } = await createAnswer({
        questionId,
        content: formData.content,
      });

      if (success && data) {
        form.reset();
        toast.success("Answer submitted successfully");
        if (editorRef.current) editorRef.current.setMarkdown("");
        const result = await createNotification({
          targetId: questionId,
          refId: data._id as string,
          receiver: authorId,
          type: "answer",
          message: `${session.data?.user?.name} has answered your question.`,
        });
        if (socket) {
          socket.emit("sendNotification", result.data);
          console.log("Notification sent successfully:", result.data);
        } else {
          console.log("Failed to send notification:", result?.error?.message);
        }
      } else {
        toast.error(error?.message || "Failed to submit answer");
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "There was a problem with your request"
      );
    } finally {
      setIsAISubmitting(false);
      setIsSubmitting(false);
    }
  };

  const generateAIAnswer = async () => {
    if (session.status !== "authenticated")
      return toast.error("Please log in to use this feature");

    setIsAISubmitting(true);
    const userAnswer = editorRef.current?.getMarkdown() || "";

    try {
      while (typeof window.puter === "undefined") {
        await new Promise((r) => setTimeout(r, 100));
      }

      const aiResponse = await window.puter.ai.chat([
        {
          role: "system",
          content: `
You are a helpful assistant that provides informative responses in markdown format. 
Use appropriate markdown syntax for headings, lists, code blocks, and emphasis where necessary. 
For code blocks, use short-form smaller case language identifiers (e.g., 'js' for JavaScript, 'py' for Python, 'ts' for TypeScript, 'html' for HTML, 'css' for CSS, etc.).
    `,
        },
        {
          role: "user",
          content: `
Generate a markdown-formatted response to the following question: "${title}".

Consider the provided context:  
**Context:** ${content}

 Also, prioritize and incorporate the user's answer when formulating your response:  
      **User's Answer:** ${userAnswer}  
      

Prioritize the user's answer only if it's correct. If it's incomplete or incorrect, improve or correct it while keeping the response concise and to the point and please avoid unnecessary space and enter, just keep the lines close but not too much when you do markdown and do not use --- in markdown.
Provide the final answer in markdown format and avoid this error Parsing of the following markdown structure failed: {"type":"thematicBreak","name":"N/A"}. You can fix the errors in source mode and switch to rich text mode when you are ready and other markdown error.
    `,
        },
      ]);
      let markdownAnswer =
        aiResponse?.message?.content
          ?.replace(/<br>/g, " ")
          ?.replace(/^---$/gm, "")
          ?.replace(/```+/g, "```") // fix lỗi block code đóng sai
          ?.trim() || "";
      console.log("AI Answer (sanitized):", markdownAnswer);

      if (editorRef.current) {
        editorRef.current.setMarkdown(markdownAnswer);
        form.setValue("content", markdownAnswer);
        form.trigger("content");
      }

      toast.success("✨ AI answer generated!");
    } catch (error) {
      console.error(error);
      toast.error("AI generation failed!");
    } finally {
      setIsAISubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">
          Write your answer here
        </h4>

        <Button
          className="btn light-border-2 gap-1.5 rounded-md border px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500"
          disabled={isAISubmitting}
          onClick={generateAIAnswer}
          type="button"
        >
          {isAISubmitting ? (
            <>
              <ReloadIcon className="mr-2 size-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Image
                src="/icons/stars.svg"
                alt="Generate AI Answer"
                width={12}
                height={12}
                className="object-contain"
              />
              Generate AI Answer
            </>
          )}
        </Button>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="mt-6 flex w-full flex-col gap-10"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormControl className="mt-3.5">
                  <Editor
                    value={field.value}
                    editorRef={editorRef}
                    fieldChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button className="primary-gradient" type="submit">
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AnswerForm;
