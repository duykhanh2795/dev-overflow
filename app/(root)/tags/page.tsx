// import { TagFilters } from "@/app/constants/filter";
// import ROUTES from "@/app/constants/routes";
// import TagCard from "@/components/cards/TagCard";
// import DataRender from "@/components/DataRender";
// import CommonFilter from "@/components/filters/CommonFilter";
// import Pagination from "@/components/Pagination";
// import LocalSearch from "@/components/search/LocalSearch";
// import { getTags } from "@/lib/actions/tag.action";

// const Tags = async ({
//   searchParams,
// }: {
//   searchParams: Promise<{ [key: string]: string }>;
// }) => {
//   const { page, pageSize, query = "", filter = "" } = await searchParams;
//   const { success, data, error } = await getTags({
//     page: Number(page) || 1,
//     pageSize: Number(pageSize) || 9,
//     query,
//     filter,
//   });
//   const { tags = [], isNext } = data || {};

//   return (
//     <>
//       <h1 className="h1-bold text-dark100_light900 text-3xl">Tags</h1>
//       <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
//         <LocalSearch
//           route={ROUTES.TAGS}
//           imgSrc="/icons/search.svg"
//           placeholder="Search questions..."
//         />
//         <CommonFilter
//           filters={TagFilters}
//           otherClasses="min-h-[52px] sm:min-w-[170px]"
//         />
//       </section>
//       <DataRender
//         success={success}
//         error={error}
//         data={tags}
//         render={(tags) => (
//           <div className="mt-10 flex w-full flex-wrap gap-4">
//             {tags.map((tag) => (
//               <TagCard key={tag._id} {...tag} compact />
//             ))}
//           </div>
//         )}
//       />
//       {data !== null && tags?.length > 0 && (
//         <Pagination page={page} isNext={isNext || false} />
//       )}
//     </>
//   );
// };

// export default Tags;
import { TagFilters } from "@/app/constants/filter";
import ROUTES from "@/app/constants/routes";
import TagCard from "@/components/cards/TagCard";
import DataRender from "@/components/DataRender";
import CommonFilter from "@/components/filters/CommonFilter";
import Pagination from "@/components/Pagination";
import LocalSearch from "@/components/search/LocalSearch";

import { getTags } from "@/lib/actions/tag.action";

const Tags = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) => {
  const { page, pageSize, query, filter } = await searchParams;

  const { success, data, error } = await getTags({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query,
    filter,
  });

  const { tags, isNext } = data || {};

  return (
    <>
      <h1 className="h1-bold text-dark100_light900 text-3xl">#Tags</h1>
      <p>
        A tag is a keyword or label that categorizes your question with other,
        similar questions. Using the right tags makes it easier for others to
        find and answer your question.
      </p>

      <div className="mt-7 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearch
          route={ROUTES.TAGS}
          imgSrc="/icons/search.svg"
          placeholder="Search tags..."
          otherClasses="flex-1"
        />

        <CommonFilter
          filters={TagFilters}
          otherClasses="min-h-[56px] sm:min-w-[170px]"
        />
      </div>

      <DataRender
        success={success}
        error={error}
        data={tags}
        // empty={EMPTY_TAGS}
        render={(tags) => (
          <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {tags.map((tag) => (
              <TagCard key={tag._id} {...tag} />
            ))}
          </div>
        )}
      />

      <Pagination page={page} isNext={isNext || false} />
    </>
  );
};

export default Tags;
