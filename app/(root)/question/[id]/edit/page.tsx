import ROUTES from "@/app/constants/routes";
import { auth } from "@/auth";
import QuestionForm from "@/components/forms/QuestionForm";
import { getQuestion } from "@/lib/actions/question.action";
import { notFound, redirect } from "next/navigation";

export default async function EditQuestion({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) return notFound();

  const session = await auth();
  if (!session) return redirect("/sign-in");

  const { data: question, success } = await getQuestion({ questionId: id });
  if (!success || !question) return notFound();

  if (question?.author._id.toString() !== session?.user?.id)
    return redirect(ROUTES.QUESTION(id));
  return (
    <main>
      <QuestionForm question={question} isEdit />
    </main>
  );
}
