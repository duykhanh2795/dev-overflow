"use client";
import { IncrementViews } from "@/lib/actions/question.action";
import { useEffect } from "react";

const View = ({ questionId }: { questionId: string }) => {
  const handleIncrement = async () => {
    const response = await IncrementViews(questionId);
    const { success, data: views } = response;
  };
  useEffect(() => {
    handleIncrement();
  }, []);
  return null;
};

export default View;
