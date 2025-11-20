"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import UserAvatar from "@/components/ui/UserAvatar";
import EditDeleteAction from "@/components/user/EditDeleteAction";
import { useSocket } from "@/context/Socket";
import { cn, getTimeStamp } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function NotificationsPage() {
  const { notifications } = useSocket();
  const r = useRouter();

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white dark:bg-black rounded-xl shadow-md">
      <h1 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Notifications
      </h1>

      {notifications?.length === 0 ? (
        <div className="flex items-center justify-center py-10 text-sm text-gray-500">
          No notifications yet
        </div>
      ) : (
        <ScrollArea className="h-[500px]">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {notifications?.map((n, i) => (
              <li
                key={i}
                className={cn(
                  "group flex gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-150",
                  !n.isRead && "bg-gray-50 dark:bg-gray-900"
                )}
                onClick={() => {
                  r.push(
                    `/question/${n.targetId}${
                      n.page && n.page > 1 ? `?page=${n.page}` : ""
                    }#answer-${n.refId}`
                  );
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
        </ScrollArea>
      )}
    </div>
  );
}
