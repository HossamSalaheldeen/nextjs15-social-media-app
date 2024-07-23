import { validateRequest } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log(`auth layout`);
  const { user } = await validateRequest();
  if (user) redirect("/");
  return <>{children}</>;
}
