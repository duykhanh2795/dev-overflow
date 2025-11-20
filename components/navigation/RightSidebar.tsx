import { getHotQuestions } from "@/lib/actions/question.action";
import { getTopTags } from "@/lib/actions/tag.action";
import Image from "next/image";
import Link from "next/link";
import TagCard from "../cards/TagCard";
import DataRender from "../DataRender";
import ROUTES from "@/app/constants/routes";

const RightSidebar = async () => {
  // const { success, data: hotQuestions, error } = await getHotQuestions();
  // const {
  //   success: tagSuccess,
  //   data: tags,
  //   error: tagError,
  // } = await getTopTags();
    const [
    { success, data: hotQuestions, error },
    { success: tagSuccess, data: tags, error: tagError },
  ] = await Promise.all([getHotQuestions(), getTopTags()]);
  // const hotQuestions = [
  //   {
  //     _id: "1",
  //     title: "How to create a custom hook in React?",
  //   },
  //   { _id: "2", title: "How to use React Query?" },
  //   { _id: "3", title: "How to use Redux?" },
  //   { _id: "4", title: "How to use React Router?" },
  //   { _id: "5", title: "How to use React Context?" },
  // ];
  // const popularTags = [
  //   { _id: "1", name: "react", questions: 100 },
  //   { _id: "2", name: "javascript", questions: 200 },
  //   { _id: "3", name: "typescript", questions: 150 },
  //   { _id: "4", name: "nextjs", questions: 50 },
  //   { _id: "5", name: "react-query", questions: 75 },
  // ];
  return (
    <section className="custom-scrollbar background-light_dark light-border shadow-light-300 sticky top-0 right-0 h-screen w-[350px] flex-col gap-6 overflow-y-auto border-l p-6 pt-28 dark:shadow-none">
      <h3 className="h3-bold text-dark200_light900">Top Question</h3>
      <DataRender
        data={hotQuestions}
        success={success}
        error={error}
        render={(hotQuestions) => (
          <div className="mt-4 flex w-full flex-col gap-4">
            {hotQuestions.map((question) => (
              <Link
                key={question._id}
                href={ROUTES.QUESTION(question._id)}
                className="flex cursor-pointer items-center justify-between gap-5"
              >
                <p className="text-[#1B75D0] line-clamp-2 text-[15px]">{question.title}</p>
                <Image
                  src="/icons/chevron-right.svg"
                  alt="Chevron"
                  width={20}
                  height={20}
                  className="invert-colors"
                />
              </Link>
            ))}
          </div>
        )}
      />
      <div>
        <h3 className="text-dark200_light800 mt-16">Popular Tags</h3>
        <DataRender
          data={tags}
          success={tagSuccess}
          error={tagError}
          render={(tags) => (
            <div className="mt-6 flex flex-col gap-4">
              {tags.map(({ _id, name, questions }) => (
                <TagCard
                  key={_id}
                  _id={_id}
                  name={name}
                  questions={questions}
                  showCount
                  compact
                />
              ))}
            </div>
          )}
        />
      </div>
    </section>
  );
};

export default RightSidebar;
