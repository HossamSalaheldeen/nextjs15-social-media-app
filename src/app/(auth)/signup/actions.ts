// https://react.dev/reference/rsc/use-server
// react directive
"use server";

import { signUpSchema, SignUpValues } from "@/lib/validation";
import { redirect } from "next/navigation";
import { hash } from "@node-rs/argon2";
import { generateIdFromEntropySize } from "lucia";
import prisma from "@/lib/prisma";
import { lucia } from "@/auth";
import { cookies } from "next/headers";
import { isRedirectError } from "next/dist/client/components/redirect";

// https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations#server-components
export async function signUp(
  credentials: SignUpValues,
): Promise<{ error: string }> {
  try {
    // validate incoming request
    const { email, username, password } = signUpSchema.parse(credentials);

    // hash request password
    const passwordHash = await hash(password, {
      memoryCost: 19456,
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });

    // check if username is taken
    const existingUsername = await prisma.user.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive",
        },
      },
    });

    if (existingUsername) {
      return {
        error: "Username already taken",
      };
    }

    // check if email is taken
    const existingEmail = await prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: "insensitive",
        },
      },
    });

    if (existingEmail) {
      return {
        error: "Email already taken",
      };
    }

    // generate id for new user
    const userId = generateIdFromEntropySize(10);

    // store new user into db
    await prisma.user.create({
      data: {
        id: userId,
        username,
        displayName: username,
        email,
        passwordHash,
      },
    });
    // create new session for user in db
    const session = await lucia.createSession(userId, {});
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
