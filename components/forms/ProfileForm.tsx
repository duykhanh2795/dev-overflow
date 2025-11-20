// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { ReloadIcon } from "@radix-ui/react-icons";
// import { useRouter } from "next/navigation";
// import { useTransition } from "react";
// import { useForm } from "react-hook-form";
// import * as z from "zod";

// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { updateUser } from "@/lib/actions/user.action";
// import ROUTES from "@/app/constants/routes";
// import { ProfileSchema } from "@/lib/validation";
// import { toast } from "sonner";
// import { Textarea } from "../ui/textarea";

// interface Params {
//   user: User;
// }

// const ProfileForm = ({ user }: Params) => {
//   const router = useRouter();
//   const [isPending, startTransition] = useTransition();

//   const form = useForm<z.infer<typeof ProfileSchema>>({
//     resolver: zodResolver(ProfileSchema),
//     defaultValues: {
//       name: user.name || "",
//       username: user.username || "",
//       portfolio: user.portfolio || "",
//       location: user.location || "",
//       bio: user.bio || "",
//     },
//   });

//   const handleUpdateProfile = async (values: z.infer<typeof ProfileSchema>) => {
//     startTransition(async () => {
//       const result = await updateUser({
//         ...values,
//       });

//       if (result.success) {
//         toast.success("Your profile has been updated successfully.");
//         //   title: "Success",
//         //   description: "Your profile has been updated successfully.",
//         // });

//         router.push(ROUTES.PROFILE(user._id));
//       } else {
//         toast.error(result.error?.message);
//       }
//     });
//   };

//   return (
//     <Form {...form}>
//       <form
//         onSubmit={form.handleSubmit(handleUpdateProfile)}
//         className="mt-9 flex w-full flex-col gap-9"
//       >
//         <FormField
//           control={form.control}
//           name="name"
//           render={({ field }) => (
//             <FormItem className="space-y-3.5">
//               <FormLabel className="paragraph-semibold text-dark400_light800">
//                 Name <span className="text-primary-500">*</span>
//               </FormLabel>
//               <FormControl>
//                 <Input
//                   className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
//                   placeholder="Your Name"
//                   {...field}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="username"
//           render={({ field }) => (
//             <FormItem className="space-y-3.5">
//               <FormLabel className="paragraph-semibold text-dark400_light800">
//                 Username <span className="text-primary-500">*</span>
//               </FormLabel>
//               <FormControl>
//                 <Input
//                   className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
//                   placeholder="Your username"
//                   {...field}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="portfolio"
//           render={({ field }) => (
//             <FormItem className="space-y-3.5">
//               <FormLabel className="paragraph-semibold text-dark400_light800">
//                 Portfolio Link
//               </FormLabel>
//               <FormControl>
//                 <Input
//                   type="url"
//                   className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
//                   placeholder="Your Portfolio link"
//                   {...field}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="location"
//           render={({ field }) => (
//             <FormItem className="space-y-3.5">
//               <FormLabel className="paragraph-semibold text-dark400_light800">
//                 Location <span className="text-primary-500">*</span>
//               </FormLabel>
//               <FormControl>
//                 <Input
//                   className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
//                   placeholder="Where do you live?"
//                   {...field}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="bio"
//           render={({ field }) => (
//             <FormItem className="space-y-3.5">
//               <FormLabel className="paragraph-semibold text-dark400_light800">
//                 Bio <span className="text-primary-500">*</span>
//               </FormLabel>
//               <FormControl>
//                 <Textarea
//                   rows={5}
//                   className="no-focus paragraph-regular light-border-2 background-light800_dark300 text-dark300_light700 min-h-[56px] border"
//                   placeholder="What's special about you?"
//                   {...field}
//                 />
//               </FormControl>
//               <FormMessage />
//             </FormItem>
//           )}
//         />

//         <div className="mt-7 flex justify-end">
//           <Button
//             type="submit"
//             className="primary-gradient w-fit"
//             disabled={isPending}
//           >
//             {isPending ? (
//               <>
//                 <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
//                 Submitting...
//               </>
//             ) : (
//               <>Submit</>
//             )}
//           </Button>
//         </div>
//       </form>
//     </Form>
//   );
// };

// export default ProfileForm;

// "use client";

// import { zodResolver } from "@hookform/resolvers/zod";
// import { ReloadIcon } from "@radix-ui/react-icons";
// import { useRouter } from "next/navigation";
// import { useTransition } from "react";
// import { useForm } from "react-hook-form";
// import * as z from "zod";

// import ROUTES from "@/app/constants/routes";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { updateUser } from "@/lib/actions/user.action";
// import { ProfileSchema } from "@/lib/validation";
// import { toast } from "sonner";
// import UserAvatar from "../ui/UserAvatar";

// interface Params {
//   user: User;
// }

// const ProfileForm = ({ user }: Params) => {
//   const router = useRouter();
//   const [isPending, startTransition] = useTransition();

//   const form = useForm<z.infer<typeof ProfileSchema>>({
//     resolver: zodResolver(ProfileSchema),
//     defaultValues: {
//       name: user.name || "",
//       username: user.username || "",
//       portfolio: user.portfolio || "",
//       location: user.location || "",
//       bio: user.bio || "",
//     },
//   });

//   const handleUpdateProfile = async (values: z.infer<typeof ProfileSchema>) => {
//     startTransition(async () => {
//       const result = await updateUser({ ...values });

//       if (result.success) {
//         toast.success("Your profile has been updated successfully.");
//         router.push(ROUTES.PROFILE(user._id));
//       } else {
//         toast.error(result.error?.message);
//       }
//     });
//   };

//   return (
//     <div className="bg-white p-8 rounded-1.5 shadow-sm">
//       <UserAvatar
//         id={user._id}
//         name={user.name}
//         img={user.image}
//         className="size-[140px] rounded-full object-cover"
//         fallbackClassName="text-6xl font-bolder"
//       />
//       <Form {...form}>
//         <form
//           onSubmit={form.handleSubmit(handleUpdateProfile)}
//           className="flex flex-col gap-6"
//         >
//           {/* Name */}
//           <FormField
//             control={form.control}
//             name="name"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="font-semibold text-gray-800">
//                   Name <span className="text-red-500">*</span>
//                 </FormLabel>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     placeholder="Enter your name"
//                     className="h-12 rounded-1.5 border border-gray-300 focus:border-blue-500 focus:ring-blue-500 outline-none"
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           {/* Username */}
//           <FormField
//             control={form.control}
//             name="username"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="font-semibold text-gray-800">
//                   Username <span className="text-red-500">*</span>
//                 </FormLabel>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     placeholder="Enter your username"
//                     className="h-12 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           {/* Portfolio */}
//           <FormField
//             control={form.control}
//             name="portfolio"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="font-semibold text-gray-800">
//                   Portfolio Link <span className="text-red-500">*</span>
//                 </FormLabel>
//                 <FormControl>
//                   <Input
//                     type="url"
//                     {...field}
//                     placeholder="Your portfolio URL"
//                     className="h-12 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           {/* Location */}
//           <FormField
//             control={form.control}
//             name="location"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="font-semibold text-gray-800">
//                   Location <span className="text-red-500">*</span>
//                 </FormLabel>
//                 <FormControl>
//                   <Input
//                     {...field}
//                     placeholder="Where do you live?"
//                     className="h-12 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           {/* Bio */}
//           <FormField
//             control={form.control}
//             name="bio"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel className="font-semibold text-gray-800">
//                   Bio
//                 </FormLabel>
//                 <FormControl>
//                   <Textarea
//                     {...field}
//                     rows={4}
//                     placeholder="Tell us something about yourself..."
//                     className="rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />

//           {/* Submit button */}
//           <div className="flex justify-end pt-4">
//             <Button
//               type="submit"
//               className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg"
//               disabled={isPending}
//             >
//               {isPending ? (
//                 <>
//                   <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
//                   Submitting...
//                 </>
//               ) : (
//                 <>Submit</>
//               )}
//             </Button>
//           </div>
//         </form>
//       </Form>
//     </div>
//   );
// };

// export default ProfileForm;
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useCallback, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateUser } from "@/lib/actions/user.action";
import { useUploadThing } from "@/lib/upload";
import { ProfileSchema } from "@/lib/validation";
import { useDropzone } from "react-dropzone";
import UserAvatar from "../ui/UserAvatar";

// Popup chọn ảnh
interface UploadPopupProps {
  onConfirm: (file: File, preview: string) => void;
  onCancel: () => void;
}

const UploadPopup = ({ onConfirm, onCancel }: UploadPopupProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const f = acceptedFiles[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-[400px] max-w-[90%]">
        <h2 className="text-lg font-semibold mb-4 text-center">
          Upload new profile image
        </h2>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl w-full p-8 flex flex-col items-center justify-center cursor-pointer ${
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-white"
          }`}
        >
          <input {...getInputProps()} />
          <p className="text-gray-600 text-sm mb-1">
            Drag & drop or click to select image
          </p>
          {preview && (
            <img
              src={preview}
              alt="preview"
              className="mt-4 w-32 h-32 object-cover rounded-full"
            />
          )}
        </div>

        <div className="flex justify-center gap-2 mt-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={!file}
            onClick={() => file && preview && onConfirm(file, preview)}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

interface Params {
  user: User;
}

const ProfileForm = ({ user }: Params) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showUploader, setShowUploader] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(user.image || null);

  // UploadThing hook
  const { startUpload, isUploading } = useUploadThing("imageUploader", {

  });

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: user.name || "",
      username: user.username || "",
      portfolio: user.portfolio || "",
      location: user.location || "",
      bio: user.bio || "",
    },
  });

  const handleSubmit = async (values: z.infer<typeof ProfileSchema>) => {
    startTransition(async () => {
      try {
        let imageUrl = user.image;

        if (selectedFile) {
          const uploadRes = await startUpload([selectedFile]);
          imageUrl = uploadRes?.[0]?.ufsUrl || uploadRes?.[0]?.url;
          if (!imageUrl) throw new Error("Upload ảnh thất bại");
        }

        const result = await updateUser({ ...values, image: imageUrl });
        if (result.success) {
          toast.success("Profile updated successfully!");
          router.refresh();
        } else {
          toast.error(result.error?.message || "Có lỗi xảy ra");
        }
      } catch (err: any) {
        toast.error(err.message || "Có lỗi xảy ra");
      }
    });
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-xl mx-auto">
      {/* Avatar + Change button */}
      <div className="flex flex-col items-center gap-4 mb-8">
        <UserAvatar
          id={user._id}
          name={user.name}
          img={preview || user.image}
          className="size-[140px] rounded-full object-cover border border-gray-300"
          fallbackClassName="text-6xl font-bold"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowUploader(true)}
          className="border border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          Change image
        </Button>
      </div>

      {/* Upload popup */}
      {showUploader && (
        <UploadPopup
          onConfirm={(file, preview) => {
            setSelectedFile(file);
            setPreview(preview);
            setShowUploader(false);
          }}
          onCancel={() => setShowUploader(false)}
        />
      )}

      {/* Form */}
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-6"
        >
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter your name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Username */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Enter your username" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Portfolio */}
          <FormField
            control={form.control}
            name="portfolio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Portfolio Link</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Portfolio URL" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Location */}
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Your location" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Bio */}
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={4}
                    placeholder="Tell us about yourself"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit */}
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isPending || isUploading}>
              {isPending || isUploading ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>Submit</>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProfileForm;
