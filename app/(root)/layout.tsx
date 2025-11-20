import LeftSidebar from "@/components/navigation/LeftSidebar";
import Navbar from "@/components/navigation/navbar";
import RightSidebar from "@/components/navigation/RightSidebar";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const session = await auth();
  // const result = await getUserNotifications({ userId: "69087ccfdf9a18f76f471634"});
  // console.log("layout notifications:", result.data?.notifications);
  return (
    <main className="background-light850_dark100 realtive">
      <Navbar />
      <div className="flex">
        <LeftSidebar />
        {/* <section className="flex min-h-screen flex-1 flex-col px-6 pt-28 pb-6 max-md:pb-14 sm:px-14 bg-white dark:bg-black"> */}
        <section className="flex min-h-screen flex-1 flex-col pt-28 pb-6 max-md:pb-14 sm:px-14 bg-white dark:bg-black">
          <div className="mx-auto w-full max-w-5xl">{children}</div>
        </section>
        <RightSidebar />
      </div>
    </main>
  );
}
