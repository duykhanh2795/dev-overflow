"use client";
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
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleX, EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import { z, ZodObject, ZodRawShape } from "zod";

interface AuthFormProps<T extends FieldValues> {
  formType: "SIGN_IN" | "SIGN_UP" | "RESET_PASSWORD" | "NEW_PASSWORD";
  schema: ZodObject<ZodRawShape>;
  defaultValues: T;
  onSubmit: (data: T, token?: string | null) => Promise<ActionResponse>;
  token?: string | null;
}

const AuthForm = <T extends FieldValues>({
  formType,
  schema,
  defaultValues,
  onSubmit,
  token,
}: AuthFormProps<T>) => {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const r = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const btnText = () => {
    if (formType === "SIGN_IN") return "Sign In";
    if (formType === "SIGN_UP") return "Sign Up";
    if (formType === "RESET_PASSWORD") return "Send Email Reset";
    if (formType === "NEW_PASSWORD") return "Reset Password";
    return "";
  };
  const getButtonText = () => {
    const text = btnText();
    if (form.formState.isSubmitting) {
      switch (text) {
        case "Sign In":
          return "Signing In...";
        case "Sign Up":
          return "Signing Up...";
        case "Send Email Reset":
          return "Sending Email...";
        case "Reset Password":
          return "Resetting Password...";
        default:
          return "Submitting...";
      }
    }
    return text;
  };
  const handleSubmit: SubmitHandler<z.infer<typeof schema>> = async (data) => {
    const result = (await onSubmit(data as T, token)) as ActionResponse;
    if (result.success) {
      r.push("/");
    } else {
      toast(
        <span className="text-[18px] font-bold text-red-500">
          <CircleX className="mr-2 inline-block" />{" "}
          {`Error ${btnText} ${result?.status}`}
        </span>,
        {
          description: (
            <p className="mt-[3px] text-red-500 font-bold">
              {`${btnText} failed`}
              <br />
              {result?.error?.message}
            </p>
          ),
          className: "text-red-500",
          duration: 4000,
          action: {
            label: "Close",
            onClick: () => toast.dismiss(),
          },
        }
      );
    }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mt-8 space-y-5"
      >
        {Object.keys(defaultValues).map((field) => (
          <FormField
            key={field}
            control={form.control}
            name={field as Path<T>}
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2">
                <FormLabel className="paragraph-semibold text-dark400_light700">
                  {field.name === "email"
                    ? "Email Address"
                    : field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      // type={(field.name === "password" || showPassword === false) ? "password" : "text"}
                      type={
                        field.name === "password"
                          ? showPassword
                            ? "text"
                            : "password"
                          : "text"
                      }
                      value={(field.value as string) || ""}
                      className={cn(
                        "hide-password-toggle pr-10",
                        "paragraph-regular text-dark300_light700 no-focus min-h-[38px] w-full rounded-[4px] border border-[#9e9e9e] !bg-transparent px-4 !py-1 text-[14px]"
                      )}
                    />
                    {field.name === "password" && field.value && (
                      <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      tabIndex={-1}
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? (
                        <EyeIcon className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        <EyeOffIcon className="h-4 w-4" aria-hidden="true" />
                      )}
                      <span className="sr-only">
                        {showPassword ? "Hide password" : "Show password"}
                      </span>
                    </Button>
                    )}
                  </div>
                </FormControl>

                <FormMessage />
                {field.name === "password" && formType === "SIGN_IN" && (
                  <Button
                    size="sm"
                    variant="link"
                    asChild
                    className="px-0 font-normal text-blue-500 self-start"
                  >
                    <Link href="/reset">Forgot password ?</Link>
                  </Button>
                )}
              </FormItem>
            )}
          />
        ))}

        <Button
          disabled={form.formState.isSubmitting}
          className="w-full rounded-[4px]"
          type="submit"
        >
          {getButtonText()}
        </Button>
        {formType === "SIGN_IN" ? (
          <p className="text-[14px] font-normal">
            Don't have an account?
            <Link
              href="/sign-up"
              className="paragraph-medium text-[14px] text-blue-500"
            >
              {"  "}Sign Up
            </Link>
          </p>
        ) : formType === "SIGN_UP" ? (
          <p className="text-[14px] font-normal">
            Already have an account?
            <Link
              href="/sign-in"
              className="paragraph-medium text-[14px] text-blue-500"
            >
              {"  "}Sign In
            </Link>
          </p>
        ) : (
          <p className="text-[14px] font-normal text-blue-500">
            <Link href="/sign-in">Back to login </Link>
          </p>
        )}
      </form>
    </Form>
  );
};

export default AuthForm;
