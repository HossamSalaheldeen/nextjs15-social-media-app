import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";
import SessionProvider from "@/app/(main)/SessionProvider";
import Navbar from "@/app/(main)/Navbar";

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
              <Navbar/>
              <div className="max-w-7xl mx-auto p-5">{children}</div>
          </div>
      </SessionProvider>
  );
}
