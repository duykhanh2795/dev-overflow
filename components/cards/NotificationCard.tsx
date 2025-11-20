"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserAvatar from "@/components/ui/UserAvatar";
import { useSocket } from "@/context/Socket";
import { cn, getTimeStamp } from "@/lib/utils";
import { Bell } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import EditDeleteAction from "../user/EditDeleteAction";

export function NotificationBell() {
  const { notifications, markAllAsRead, markAsRead } = useSocket();
  console.log("notifications in bell", notifications);
  const [open, setOpen] = useState(false);
  const r = useRouter();

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <div className="relative cursor-pointer">
          <Bell className="h-5 w-5 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white" />
          {notifications?.some((n) => !n.isRead) && (
            <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500" />
          )}
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        side="left"
        className="!w-[380px] p-0 shadow-lg rounded-2 overflow-hidden dark:bg-black"
      >
        <DropdownMenuLabel className="flex justify-between items-center px-4 py-2 text-base font-semibold border-b border-gray-200 dark:border-gray-800">
          <p>Notifications</p>
          {(notifications?.length ?? 0) > 0 && (
            <div className="flex items-center gap-1 cursor-pointer hover:opacity-80">
              <button
                className="text-[13px] text-blue-600 font-medium cursor-pointer"
                onClick={markAllAsRead}
              >
                Mark all as read
              </button>
              <Image
                src="/icons/tick.svg"
                height={14}
                width={14}
                alt="Mark all as read"
              />
            </div>
          )}
        </DropdownMenuLabel>

        <ScrollArea className="h-[350px]">
          {notifications?.length === 0 ? (
            <div className="flex items-center justify-center py-10 text-sm text-gray-500">
              No notifications yet
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700 !dark:bg-black">
              {notifications?.map((n, i) => (
                <li
                  key={i}
                  className={cn(
                    "group flex gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-150",
                    !n.isRead && "bg-gray-50 dark:bg-black"
                  )}
                  onClick={() => {
                    r.push(
                      `/question/${n.targetId}${
                        n.page && n.page > 1 ? `?page=${n.page}` : ""
                      }#${n.type === "answer" ? "answer" : "comment"}-${n.refId}`
                    );
                    markAsRead(n._id);
                    setOpen(false);
                    r.refresh();
                  }}
                >
                  <UserAvatar
                    id=""
                    img={n.sender?.image || "/images/user.png"}
                    name={n.sender?.name || "User"}
                  />
                  <div className="flex-1 relative">
                    <p className="relative text-sm text-gray-800 dark:text-gray-200">
                      <span className="font-semibold">{n.sender.name}</span>{" "}
                      {n.message}
                      <EditDeleteAction
                        type="Notification"
                        itemId={n._id}
                        removeIcon="/icons/cross.svg"
                        otherClasses="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                      />
                    </p>
                    <p className="mt-1 text-xs text-gray-500 italic">
                      {getTimeStamp(new Date(n.createdAt))}
                    </p>
                    {!n.isRead && (
                      <span className="absolute right-0 top-2/3 h-2 w-2 -translate-y-1/2 rounded-full bg-blue-500" />
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </ScrollArea>

        <div className="border-t border-gray-200 dark:border-gray-800 dark:bg-black">
          <button
            onClick={() => r.push("/notifications")}
            className="cursor-pointer w-full flex items-center justify-center gap-2 text-sm text-[12px] text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            View all notifications
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
