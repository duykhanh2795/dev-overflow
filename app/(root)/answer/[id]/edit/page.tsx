import EditAnswerForm from "@/components/forms/EditAnswerForm";
import { getAnswer } from "@/lib/actions/answer.action";
import { notFound } from "next/navigation";

const EditAnswer = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const { data: answer, success } = await getAnswer({ answerId: id });
  if (!success || !answer) return notFound();
  return (
    <main>
      <EditAnswerForm answer={answer} />
    </main>
  );
};

export default EditAnswer;
