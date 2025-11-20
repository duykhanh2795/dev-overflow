import { auth } from "@/auth";
import QuestionCard from "@/components/cards/QuestionCard";
import DataRender from "@/components/DataRender";
import CommonFilter from "@/components/filters/CommonFilter";
import HomeFilter from "@/components/filters/HomeFilter";
import Pagination from "@/components/Pagination";
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import { getQuestions } from "@/lib/actions/question.action";
import Link from "next/link";
import { HomePageFilters } from "../constants/filter";
import ROUTES from "../constants/routes";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string;
  }>;
}) {
  const loggedInUser = await auth();

  const { page, pageSize, query = "", filter = "" } = await searchParams;
  const { data, success, error } = await getQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 4,
    query,
    filter,
  });
  const { questions, isNext } = data || {};
  // const filteredQuestion = question.filter((q) => {
  //   const matchedQuery = q.title
  //     .toLowerCase()
  //     .includes(query?.toLowerCase());
  //   const matchedFilter = filter
  //     ? q.title
  //         .toLowerCase()
  //         .includes(filter?.toLowerCase())
  //     : true;
  //   return matchedQuery && matchedFilter;
  // });
  // console.log("Questions:", questions);
  return (
    <>
      <section className="gap 4 flex w-full flex-col-reverse justify-between sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">
          All Questions{" "}
          <p className="paragraph-regular text-[20px] font-bold text-[#414141]">
            2,435,548 quetions
          </p>
        </h1>

        <Button asChild className="primary-gradient min-h-[42px] rounded-[5px]">
          <Link href={ROUTES.ASK_QUESTION}>Ask a Question</Link>
        </Button>
      </section>
      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route="/"
          imgSrc="/icons/search.svg"
          placeholder="Search questions..."
        />
        <CommonFilter
          filters={HomePageFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </section>
      <HomeFilter />
      <div className="flex w-full flex-col gap-6">
        <DataRender
          success={success}
          error={error}
          data={questions}
          render={(questions) => (
            <>
              {questions.map((question) => (

                  <QuestionCard
                    key={question._id}
                    question={question}
                    showActionBtns={
                      loggedInUser?.user?.id === question.author._id
                    }
                  />

              ))}
            </>
          )}
        />
      </div>
      <Pagination page={page} isNext={isNext || false} />
    </>
  );
}
