import "server-only";
import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";
import { notFound } from "next/navigation";


export async function adminGetLesson(id: string) {
    await requireAdmin();

    const data = await prisma.lesson.findUnique({
        where: {
            id: id,
        },
        select: {
            title: true,
            description: true,
            videoKey: true,
            thumbnailKey: true,
            position: true,
            id: true,
            documents: {
                select: {
                    id: true,
                    name: true,
                    fileKey: true,
                    position: true,
                },
                orderBy: {
                    position: 'asc',
                },
            },
        },
    });

    if (!data) {
        return notFound();
    }

    return data;
}

export type AdminLessonType = Awaited<ReturnType<typeof adminGetLesson>>;