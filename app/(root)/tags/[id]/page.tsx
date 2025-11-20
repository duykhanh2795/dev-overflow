// import QuestionCard from "@/components/cards/QuestionCard";
// import DataRender from "@/components/DataRender";
// import { getQuestions } from "@/lib/actions/question.action";

// const Page = async ({
//   params,
//   searchParams,
// }: {
//   params: Promise<{ [key: string]: string }>;
//   searchParams: Promise<{ [key: string]: string }>;
// }) => {
//   const { id } = await params;
//   const { page, pageSize, query, filter } = await searchParams;
//   const { success, data, error } = await getQuestions({
//     page: Number(page) || 1,
//     pageSize: Number(pageSize) || 9,
//     query: query || id,
//     filter,
//   });
//   const questions = data?.questions || [];

//   return (
//     <>
//     <h2>All tagged questions</h2>
//     <div className="mt-10 flex w-full flex-col gap-6">
//       <DataRender
//         success={success}
//         error={error}
//         data={questions}
//         render={(questions) =>
//           questions.map((question) => (
//             <QuestionCard key={question._id} question={question} />
//           ))
//         }
//       />
//     </div>
//     </>
//   );
// };

// export default Page;
import ROUTES from "@/app/constants/routes";
import QuestionCard from "@/components/cards/QuestionCard";
import DataRender from "@/components/DataRender";

import Pagination from "@/components/Pagination";
import LocalSearch from "@/components/search/LocalSearch";

import { getTagQuestions } from "@/lib/actions/tag.action";

const Page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ [key: string]: string }>;
  searchParams: Promise<{ [key: string]: string }>;
}) => {
  const { id } = await params;
  const { page, pageSize, query } = await searchParams;

  const { success, data, error } = await getTagQuestions({
    tagId: id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
  });

  const { tag, questions, isNext } = data || {};

  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">{tag?.name}</h1>
      </section>

      <section className="mt-11">
        <LocalSearch
          route={ROUTES.TAG(id)}
          imgSrc="/icons/search.svg"
          placeholder="Search questions..."
          otherClasses="flex-1"
        />
      </section>

      <DataRender
        success={success}
        error={error}
        data={questions}
        // empty={EMPTY_QUESTION}
        render={(questions) => (
          <div className="mt-10 flex w-full flex-col gap-6">
            {questions.map((question) => (
              <QuestionCard key={question._id} question={question} />
            ))}
          </div>
        )}
      />

      <Pagination page={page} isNext={isNext || false} />
    </>
  );
};

export default Page;
