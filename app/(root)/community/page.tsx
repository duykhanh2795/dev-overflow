import { UserFilters } from "@/app/constants/filter";
import ROUTES from "@/app/constants/routes";
import UserCard from "@/components/cards/UserCard";
import DataRender from "@/components/DataRender";
import CommonFilter from "@/components/filters/CommonFilter";
import Pagination from "@/components/Pagination";
import LocalSearch from "@/components/search/LocalSearch";
import { getUsers } from "@/lib/actions/user.action";

const Community = async ({
  searchParams,
}: {
  searchParams: Promise<{
    [key: string]: string;
  }>;
}) => {
  const { page, pageSize, query, filter } = await searchParams;
  const { success, data, error } = await getUsers({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 9,
    query: query || "",
    filter: filter || "",
  });
  const { users, isNext } = data || {};
  return (
    <>
      <div>
        <h1 className="h1-bold text-dark100_light900">All Users</h1>
        <section className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
          <LocalSearch
            route={ROUTES.COMMUNITY}
            imgSrc="/icons/search.svg"
            placeholder="Search questions..."
          />
          <CommonFilter
            filters={UserFilters}
            otherClasses="min-h-[52px] sm:min-w-[170px]"
          />
        </section>
        <DataRender
          data={users}
          error={error}
          success={success}
          render={(users) => (
            <div className="mt-11 flex flex-wrap gap-5">
              {users.map((user) => (
                <UserCard key={user._id} {...user} />
              ))}
            </div>
          )}
        />
      </div>
      <Pagination page={page} isNext={isNext || false} />
    </>
  );
};

export default Community;
