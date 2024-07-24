import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";
import SessionProvider from "@/app/(main)/SessionProvider";
import Navbar from "@/app/(main)/Navbar";
import MenuBar from "@/app/(main)/MenuBar";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log(`main layout`);
  const session = await validateRequest();
  console.log(session);
  if (!session.user) redirect("/login");
  return (
    <SessionProvider value={session}>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="mx-auto flex w-full max-w-7xl grow gap-5 p-5">
          <MenuBar className="sticky top-[5.25rem] hidden h-fit flex-none space-y-3 rounded-2xl bg-card shadow-sm sm:block lg:px-5 xl:w-80" />
          {children}
        </div>
        <MenuBar className="sticky bottom-0 flex w-full justify-center gap-5 bg-card p-3 shadow-sm sm:hidden" />
      </div>
    </SessionProvider>
  );
}
