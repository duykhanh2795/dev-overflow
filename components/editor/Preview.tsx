// import { Code } from "bright";
// import { MDXRemote } from "next-mdx-remote/rsc";

// Code.theme = {
//   light: "github-light",
//   dark: "github-dark",
//   lightSelector: "html.light",
// };

// export const Preview = ({ content }: { content: string }) => {
//   const formattedContent = content.replace(/\\/g, "").replace(/&#x20;/g, "");

//   return (
//     <section className="markdown prose grid break-words">
//       <MDXRemote
//         source={formattedContent}
//         components={{
//           pre: (props) => (
//             <Code
//               {...props}
//               lineNumbers
//               className="shadow-light-200 dark:shadow-dark-200"
//             />
//           ),
//         }}
//       />
//     </section>
//   );
// };
import { Code } from "bright";
import { MDXRemote } from "next-mdx-remote/rsc";

Code.theme = {
  light: "github-light",
  dark: "github-dark",
  lightSelector: "html.light",
};

export const Preview = ({ content, question = false }: { content: string, question?: boolean }) => {
  const formattedContent = content.replace(/\\/g, "").replace(/&#x20;/g, "");

  return (
    <section className={`markdown prose !wrap-anywhere grid line-clamp-1 ${question ? "bg-[#F4F6F8] p-[12px] rounded-2" : ""}`}>
      <MDXRemote
        source={formattedContent}
        components={{
          pre: (props) => (
            <Code
              {...props}
              lineNumbers
              className="shadow-light-200 dark:shadow-dark-200 "
            />
          ),
        }}
      />
    </section>
  );
};
