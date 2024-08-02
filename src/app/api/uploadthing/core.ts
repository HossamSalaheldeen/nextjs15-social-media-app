import { createUploadthing, type FileRouter } from "uploadthing/next";
import {UploadThingError, UTApi} from "uploadthing/server";
import {validateRequest} from "@/auth";
import prisma from "@/lib/prisma";

const f = createUploadthing();


// FileRouter for your app, can contain multiple FileRoutes
export const fileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    avatar: f({ image: { maxFileSize: "4MB" } })
        // Set permissions and file types for this FileRoute
        .middleware(async ({ req }) => {
            const { user } = await validateRequest();

            if (!user) throw new UploadThingError("Unauthorized");

            return { user };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            const oldAvatarUrl = metadata.user.avatarUrl;

            if (oldAvatarUrl) {
                const key = oldAvatarUrl.split(
                    `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
                )[1];

                await new UTApi().deleteFiles(key);
            }

            const newAvatarUrl = file.url.replace(
                "/f/",
                `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`,
            );

            await prisma.user.update({
                where: { id: metadata.user.id },
                data: {
                    avatarUrl: newAvatarUrl,
                },
            });

            return { avatarUrl: newAvatarUrl };
        }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;