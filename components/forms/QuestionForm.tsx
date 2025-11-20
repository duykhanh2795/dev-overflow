"use client";
import ROUTES from "@/app/constants/routes";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createQuestion, editQuestion } from "@/lib/actions/question.action";
import { AskQuestionSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { MDXEditorMethods } from "@mdxeditor/editor";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import TagCard from "../cards/TagCard";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

const QuestionForm = ({
  question,
  isEdit = false,
}: {
  question?: Question;
  isEdit?: boolean;
}) => {
  const r = useRouter();
  const editorRef = useRef<MDXEditorMethods>(null);

  const form = useForm({
    resolver: zodResolver(AskQuestionSchema),
    defaultValues: {
      title: question?.title || "",
      content: question?.content || "",
      tags: question?.tags.map((tag) => tag.name) || [],
    },
  });

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: { value: string[] }
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const tag = e.currentTarget.value.trim();
      if (tag.length <= 15 && !field.value.includes(tag)) {
        form.setValue("tags", [...field.value, tag]);
        form.clearErrors("tags");
        e.currentTarget.value = "";
      } else if (tag.length > 15) {
        form.setError("tags", {
          type: "manual",
          message: "Tag length should be less than 15 characters",
        });
      } else if (field.value.includes(tag)) {
        form.setError("tags", {
          type: "manual",
          message: "Tag already exists",
        });
      }
    }
  };
  const handleCreateQuestion = async (
    data: z.infer<typeof AskQuestionSchema>
  ) => {
    if (isEdit && question) {
      const result = await editQuestion({ questionId: question?._id, ...data });
      if (result?.success && result?.data) {
        toast.success("Question updated successfully");
        r.push(ROUTES.QUESTION(result.data._id));
      } else {
        toast(
          <span className="text-[18px] font-bold text-red-500">
            {`Error ${result?.status}`}
          </span>,
          {
            description: (
              <p className="mt-[3px] text-red-500 font-bold">
                {result?.error?.message || "Question update failed"}
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
      return;
    }
    const result = await createQuestion(data);
    if (result?.success && result?.data) {
      toast.success("Question updated successfully");
      r.push(ROUTES.QUESTION(result.data._id));
    } else {
      toast(
        <span className="text-[18px] font-bold text-red-500">
          {`Error ${result?.status}`}
        </span>,
        {
          description: (
            <p className="mt-[3px] text-red-500 font-bold">
              {result?.error?.message || "Question creation failed"}
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
  const handleRemoveTag = (tag: string, field: string[]) => {
    const newTags = field.filter((t) => t !== tag);
    form.setValue("tags", newTags);
    if (newTags.length === 0) {
      form.setError("tags", {
        type: "manual",
        message: "Please add at least one tag",
      });
    } else {
      form.clearErrors("tags");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateQuestion)}
        className="mt-8 space-y-8"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-2 border border-[#ececec] rounded-2 p-4">
              <FormLabel className="paragraph-semibold text-dark400_light700">
                Question Title
              </FormLabel>
              <FormControl>
                <Input
                  className="paragraph-regular text-dark300_light700 no-focus min-h-[50px] w-full rounded-[4px] border border-[#9e9e9e] !bg-transparent px-4 !py-1 text-[14px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>You are asking a question</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-2">
              <FormLabel className="paragraph-semibold text-dark400_light700">
                Content
              </FormLabel>
              <FormControl>
                <Editor
                  value={field.value}
                  fieldChange={field.onChange}
                  editorRef={editorRef}
                />
              </FormControl>
              <FormDescription>You are asking a question</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="paragraph-semibold text-dark400_light700">
                Tags
              </FormLabel>
              <FormControl>
                <div>
                  <Input
                    className="paragraph-regular text-dark300_light700 no-focus min-h-[50px] w-full rounded-[4px] border border-[#9e9e9e] !bg-transparent px-4 !py-1 text-[14px]"
                    placeholder="Add tags..."
                    onKeyDown={(e) => handleKeyDown(e, field)}
                  />
                  {field.value.length > 0 && (
                    <div className="flex-start mt-2 flex flex-wrap gap-2">
                      {field?.value?.map((tag) => (
                        <TagCard
                          key={tag}
                          _id={tag}
                          name={tag}
                          isButton
                          compact
                          remove
                          handleRemove={() =>
                            handleRemoveTag(tag, field.value)
                          }
                        />
                      ))} 
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>You are asking a question</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-16 flex w-full justify-end">
          <Button type="submit">
            {isEdit ? "Update Question" : "Ask a Question"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
export default QuestionForm;
