"use client";
import { saveQuestion } from "@/lib/actions/collection.action";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { use, useState } from "react";
import { toast } from "sonner";

const SaveQuestion = ({
  questionId,
  hasSavedPromise,
}: {
  questionId: string;
  hasSavedPromise: Promise<ActionResponse<{ saved: boolean }>>;
}) => {
  const session = useSession();
  const userId = session.data?.user?.id;
  const [isLoading, setIsLoading] = useState(false);

  const { data } = use(hasSavedPromise);
  const { saved: hasSaved } = data || {};

  const handleSave = async () => {
    if (isLoading) return;
    if (!userId)
      return toast.message("You must be logged in to save questions.");
    setIsLoading(true);
    try {
      const { success, data, error } = await saveQuestion({ questionId });
      if (!success)
        throw new Error(
          error?.message || "Failed to save the question. Please try again."
        );
      toast.success(
        `Question ${data?.saved ? "saved" : "unsaved"} successfully.`
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error?.message
          : "An error occurred while saving the question."
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Image
        src={hasSaved ? "/icons/star-filled.svg" : "/icons/star-red.svg"}
        width={18}
        height={18}
        alt="Save Question"
        className={`cursor-pointer ${isLoading && "opacity-70"}`}
        aria-label="save question"
        onClick={handleSave}
      />
    </>
  );
};

export default SaveQuestion;
