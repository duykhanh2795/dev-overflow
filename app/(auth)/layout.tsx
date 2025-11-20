import SocialAuthForm from "@/components/forms/SocialAuthForm";
import Image from "next/image";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="bg-auth-light dark:bg-auth-dark flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat px-4 py-10">
      <section className="light-border shadow-light100_dark100 max-w-[380px] rounded-[6px] border bg-[#ffffff] px-4 py-10 shadow-md sm:px-8 dark:bg-[#151515] dark:shadow-none">
        <div className="flex items-center justify-between gap-2">
          <div className="space-y-2.5">
            <p className="h2-bold font-space-grotesk text-dark-100 dark:text-light-900">
              Join Dev
              <span className="text-primary-500">
                Forum 
              </span>
            </p>
            <p className="paragraph-regular text-dark500_light400">
              To get your answer
            </p>
          </div>
          <Image
            src="/images/output-onlinepngtools.png"
            alt="Site Logo"
            height={70}
            width={70}
            className="object-contain"
          />
        </div>
        {children} <SocialAuthForm />
      </section>
    </main>
  );
}
