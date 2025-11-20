import { CollectionFilters } from "@/app/constants/filter";
import ROUTES from "@/app/constants/routes";
import QuestionCard from "@/components/cards/QuestionCard";
import DataRender from "@/components/DataRender";
import CommonFilter from "@/components/filters/CommonFilter";
import Pagination from "@/components/Pagination";
import LocalSearch from "@/components/search/LocalSearch";
import { getSavedQuestion } from "@/lib/actions/collection.action";

export default async function Collections({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string;
  }>;
}) {
  const { page, pageSize, query = "", filter = "" } = await searchParams;
  const { data, success, error } = await getSavedQuestion({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
    filter,
  });
  console.log("Error:", error);
  const { collections, isNext } = data || {};
  return (
    <>
      <section className="gap 4 flex w-full flex-col-reverse justify-between sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">
          Saved Questions{" "}
          <p className="paragraph-regular text-[20px] font-bold text-[#414141]">
            2,435,548 quetions
          </p>
        </h1>
      </section>
      <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route={ROUTES.COLLECTION}
          imgSrc="/icons/search.svg"
          placeholder="Search questions..."
        />
        <CommonFilter
          filters={CollectionFilters}
          otherClasses="min-h-[52px] sm:min-w-[170px]"
        />
      </section>
      <div className="mt-10 flex w-full flex-col gap-6">
        <DataRender
          success={success}
          error={error}
          data={collections}
          render={(collections) =>
            collections.map((collection) => (
              <QuestionCard
                key={collection._id}
                question={collection.question}
              />
            ))
          }
        />
      </div>
      <Pagination page={page} isNext={isNext || false} />
    </>
  );
}
