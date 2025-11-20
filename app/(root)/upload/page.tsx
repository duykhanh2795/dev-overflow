// "use client";

// import { Textarea } from "@/components/ui/textarea";
// import UserAvatar from "@/components/ui/UserAvatar";
// import { updateUser } from "@/lib/actions/user.action";
// import { useUploadThing } from "@/lib/upload";
// import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { useCallback, useState } from "react";
// import { useDropzone } from "react-dropzone";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import { toast } from "sonner";
// export default function EditUserPage() {
//   const router = useRouter();
//   const { data: session } = useSession();
//   const user = session?.user;
//   const [value, setValue] = useState("");
//   const [preview, setPreview] = useState<string | null>(null);
//   const [file, setFile] = useState<File | null>(null);
//   const [loading, setLoading] = useState(false);

//   // Khởi tạo UploadThing hook
//   const { startUpload, isUploading } = useUploadThing("imageUploader", {
//     onClientUploadComplete: () => {
//       setFile(null);
//       setPreview(null);
//       toast.success("Upload hoàn tất!");
//     },
//     onUploadError: (err) => {
//       toast.error(`Upload lỗi: ${err.message}`);
//     },
//   });

//   // Khi người dùng chọn file
//   const onDrop = useCallback((acceptedFiles: File[]) => {
//     const selected = acceptedFiles[0];
//     if (selected) {
//       setFile(selected);
//       setPreview(URL.createObjectURL(selected));
//     }
//   }, []);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     onDrop,
//     accept: { "image/*": [] },
//     multiple: false,
//   });

//   // Khi nhấn Submit -> upload lên UploadThing + cập nhật DB
//   const handleSubmit = async () => {
//     if (!file) {
//       toast.error("Vui lòng chọn ảnh trước khi lưu");
//       return;
//     }

//     try {
//       setLoading(true);

//       // Upload file lên UploadThing
//       const uploadRes = await startUpload([file]);
//       const uploadedUrl = uploadRes?.[0]?.ufsUrl || uploadRes?.[0]?.url;

//       if (!uploadedUrl) throw new Error("Upload thất bại");

//       // Cập nhật user
//       const res = await updateUser({ image: uploadedUrl });
//       if (res.success) {
//         toast.success("Cập nhật ảnh đại diện thành công!");
//         router.refresh();
//       } else {
//         toast.error("Lỗi khi cập nhật user");
//       }
//     } catch (err: any) {
//       toast.error(err.message || "Có lỗi xảy ra");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-8">
//       {/* Vùng kéo-thả ảnh */}
//       <div
//         {...getRootProps()}
//         className={`border-2 border-dashed rounded-xl w-80 p-8 flex flex-col items-center justify-center cursor-pointer transition-colors
//     ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"}
//   `}
//       >
//         <input {...getInputProps()} />

//         {/* Icon upload */}
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           className="h-12 w-12 text-gray-400 mb-3"
//           fill="none"
//           viewBox="0 0 24 24"
//           stroke="currentColor"
//         >
//           <path
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             strokeWidth={2}
//             d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4-4v12"
//           />
//         </svg>

//         {/* Text hướng dẫn */}
//         <p className="text-gray-600 text-sm mb-1">Kéo & thả ảnh vào đây</p>
//         <p className="text-gray-400 text-xs mb-4">Image (2MB)</p>

//         {/* Nút chọn ảnh */}
//         <button
//           type="button"
//           className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
//         >
//           Chọn ảnh
//         </button>
//       </div>

//       {/* Preview ảnh */}
//       <UserAvatar
//         id={user?.id as string}
//         name={user?.name as string}
//         img={preview || (user?.image as string)}
//         className="size-[140px] rounded-full object-cover"
//         fallbackClassName="text-6xl font-bolder"
//       />

//       {/* Nút lưu */}
//       <button
//         onClick={handleSubmit}
//         disabled={loading || isUploading}
//         className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
//       >
//         {loading || isUploading ? "Đang lưu..." : "Lưu thay đổi"}
//       </button>
//       <div className="grid grid-cols-2 gap-4">
//         {/* Editor */}
//         <Textarea
//           value={value}
//           onChange={(e) => setValue(e.target.value)}
//           placeholder="Write Markdown..."
//           className="h-64"
//         />

//         {/* Preview */}
//         <div className="prose dark:prose-invert p-4 border rounded-md">
//           <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
//         </div>
//       </div>
//     </main>
//   );
// }
"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserAvatar from "@/components/ui/UserAvatar";
import EditDeleteAction from "@/components/user/EditDeleteAction";
import { useSocket } from "@/context/Socket";
import { cn, getTimeStamp } from "@/lib/utils";
import { Bell } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function Page() {
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
