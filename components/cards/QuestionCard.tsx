// import ROUTES from "@/app/constants/routes";
// import { getTimeStamp } from "@/lib/utils";
// import Image from "next/image";
// import Link from "next/link";
// import TagCard from "./TagCard";

// const QuestionCard = ({
//   question: {
//     _id,
//     title,
//     content,
//     tags,
//     author,
//     createdAt,
//     upvotes,
//     answers,
//     views,
//   },
// }: {
//   question: Question;
// }) => {
//   return (
//     <div className="card-wrapper rounded-2 p-9 sm:px-11">
//       <div className="flex flex-col-reverse items-start justify-between gap-3 sm:flex-row">
//         <div>
//           <div className="flex items-center gap-2 text-sm text-dark500_light700 mb-2">
//             <Image
//               src={author.image}
//               alt={author.name}
//               width={30}
//               height={30}
//               className="rounded-full object-cover"
//             />
//             <span>{author.name}</span>
//             <span> asked • {getTimeStamp(createdAt)}</span>
//           </div>

//           <Link href={ROUTES.QUESTION(_id)}>
//             <h3 className="text-dark200_light900 line-clamp-1 flex-1">
//               {title}
//             </h3>
//             <p className="line-clamp-3">{content}</p>
//           </Link>
//           <div className="flex flex-1 items-center gap-3 text-sm text-dark500_light700 mt-2">
//             <div className="flex items-center gap-1">
//               <Image
//                 src="/icons/upvote.svg"
//                 alt="Upvote"
//                 width={20}
//                 height={20}
//               />
//               <span>{upvotes}</span>
//               <Image
//                 src="/icons/downvote.svg"
//                 alt="Upvote"
//                 width={20}
//                 height={20}
//               />
//             </div>
//             <div className="flex items-center gap-1">
//               <Image
//                 src="/icons/messenger.png"
//                 alt="Upvote"
//                 width={18}
//                 height={18}
//               />
//               <span>{upvotes}</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <Image
//                 src="/icons/share.svg"
//                 alt="Share"
//                 width={20}
//                 height={20}
//               />
//               <span>{upvotes}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//       <div className="mt-3.5 flex w-full flex-wrap gap-2">
//         {tags &&
//           tags.map((tag: Tag) => (
//             <TagCard key={tag._id} _id={tag._id} name={tag.name} />
//           ))}
//       </div>
//     </div>
//   );
// };

// export default QuestionCard;
import Link from "next/link";

import { getTimeStamp } from "@/lib/utils";

import ROUTES from "@/app/constants/routes";
// import { Separator } from "@radix-ui/react-separator";
import Metric from "../Metric";
import EditDeleteAction from "../user/EditDeleteAction";
import TagCard from "./TagCard";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";

interface Props {
  question: Question;
  showActionBtns?: boolean;
}

const QuestionCard = ({
  question: {
    _id,
    title,
    tags,
    author,
    createdAt,
    upvotes,
    answers,
    views,
    content,
  },
  showActionBtns = false,
}: Props) => {
  return (
    <>
      <div className="card-wrapper rounded-[10px] p-9 !py-6 sm:px-11">
        <div className="flex flex-col-reverse items-center justify-between gap-5 sm:flex-row min-w-0">
          <div className="flex-1">
            <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
              {getTimeStamp(new Date(createdAt))}
            </span>

            <Link href={ROUTES.QUESTION(_id)}>
              <h3 className="sm:h3-semibold base-medium !font-normal !text-[17px] text-dark200_light900 line-clamp-2 flex-1 !text-[#1B75D0]">
                {title}
              </h3>
              <p className="line-clamp-2 flex-1 !text-[15px]">
                {content}
                {" "}
                {/* <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content}
                </ReactMarkdown> */}
              </p>
            </Link>
          </div>

          {showActionBtns && <EditDeleteAction type="Question" itemId={_id} />}
        </div>

        <div className="mt-3.5 flex w-full flex-wrap gap-2">
          {tags.map((tag: Tag) => (
            <TagCard key={tag._id} _id={tag._id} name={tag.name} compact />
          ))}
        </div>

        <div className="flex-between mt-4 w-full flex-wrap gap-3">
          <Metric
            imgUrl={author.image}
            alt={author.name}
            value={author.name}
            title={`• asked ${getTimeStamp(createdAt)}`}
            href={ROUTES.PROFILE(author._id)}
            textStyles="body-medium text-dark400_light700"
            isAuthor
            titleStyles="max-sm:hidden"
          />

          <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
            <Metric
              imgUrl="/icons/like.svg"
              alt="like"
              value={upvotes}
              title=" Votes"
              textStyles="small-medium text-dark400_light800"
            />
            <Metric
              imgUrl="/icons/message.svg"
              alt="answers"
              value={answers}
              title=" Answers"
              textStyles="small-medium text-dark400_light800"
            />
            <Metric
              imgUrl="/icons/eye.svg"
              alt="views"
              value={views}
              title=" Views"
              textStyles="small-medium text-dark400_light800"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionCard;
