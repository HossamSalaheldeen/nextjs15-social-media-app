// https://react.dev/reference/rsc/use-server
// react directive
"use server";

import { loginSchema, LoginValues } from "@/lib/validation";
import { redirect } from "next/navigation";
import { verify } from "@node-rs/argon2";
import prisma from "@/lib/prisma";
import { lucia } from "@/auth";
import { cookies } from "next/headers";
import { isRedirectError } from "next/dist/client/components/redirect";

// https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#server-components
export async function login(
  credentials: LoginValues,
): Promise<{ error: string }> {
  try {
    // validate incoming request
    const { username, password } = loginSchema.parse(credentials);

    // check if user with username is taken
    const existingUser = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    if (!existingUser) {
      return {
        error: "incorrect username",
      };
    }

    if (!existingUser.passwordHash) {
      return {
        error: "user doesn't have password",
      };
    }

    // check if email is taken
    const validPassword = await verify(existingUser.passwordHash, password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    if (!validPassword) {
      return {
        error: "incorrect password",
      };
    }

    // create new session for user in db
    const session = await lucia.createSession(existingUser.id, {});
    // set new cookie in the response
    // https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#cookies
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    // redirect user to root page
    // https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#redirecting
    return redirect("/");
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.error(error);
    return {
      error: "something went wrong. Please try again",
    };
  }
}
