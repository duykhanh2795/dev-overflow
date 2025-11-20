import { AnswerFilters } from "@/app/constants/filter";
import { auth } from "@/auth";
import AnswerCard from "../cards/AnswerCard";
import DataRender from "../DataRender";
import CommonFilter from "../filters/CommonFilter";
import Pagination from "../Pagination";

const Answers = async ({
  page,
  isNext,
  success,
  data = [],
  error,
  totalAnswers,
  questionId,
}: ActionResponse<Answer[]> & {
  page: number;
  isNext: boolean;
  totalAnswers: number;
  questionId: string;
}) => {
  const loggedInUser = await auth();
  return (
    <>
      <div className="mt-11">
        <div className="flex items-center justify-between">
          <h3 className="primary-text-gradient">
            {totalAnswers} {totalAnswers === 1 ? "Answer" : "Answers"}
          </h3>
          <CommonFilter
            filters={AnswerFilters}
            otherClasses="sm:min-32"
            containerClasses="max-xs:w-full"
          />
        </div>
        <DataRender
          data={data}
          error={error}
          success={success}
          render={(answers) =>
            answers.map((answer) => (
              <AnswerCard
                key={answer._id}
                {...answer}
                showActionBtns={loggedInUser?.user?.id === answer.author._id}
              />
            ))
          }
        />
      </div>
      {data !== null && data.length > 0 && (
        <Pagination page={page} isNext={isNext || false} />
      )}
    </>
  );
};

export default Answers;
