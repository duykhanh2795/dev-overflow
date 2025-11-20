"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, Share, Share2 } from "lucide-react";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
} from "next-share";
const SocialShare = ({
  title,
  url,
  hashTag = "#Dev Forum",
}: {
  title?: string;
  url: string;
  hashTag?: string;
}) => {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none mt-8">
          <div className="flex items-center gap-1">
            <Share className="h-4 w-4 text-black hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" />{" "}
            <span>Share</span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuItem>
            <Link /> Copy link
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Share2 />
            <FacebookShareButton
              url={"https://stackoverflow.com/questions/79810126/how-to-create-a-random-auth-key-in-c"}
              quote={
                "next-share is a social share buttons for your next React apps."
              }
              hashtag={hashTag}
            >
              <FacebookIcon round className="!w-6 !h-6" />
            </FacebookShareButton>
            <EmailShareButton
              url={"https://github.com/next-share"}
              subject={"Next Share"}
              body="body"
            >
              <EmailIcon round className="!w-6 !h-6" />
            </EmailShareButton>
            <TwitterShareButton
              url={"https://github.com/next-share"}
              title={
                "next-share is a social share buttons for your next React apps."
              }
            >
              <TwitterIcon round className="!w-6 !h-6" />
            </TwitterShareButton>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default SocialShare;
