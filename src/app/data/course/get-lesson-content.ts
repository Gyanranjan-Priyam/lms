import "server-only";
import { requireUser } from "../user/require-user";
import { prisma } from "@/lib/db";

export async function getLessonContent(lessonId: string) {
   const session = await requireUser();

   const lesson = await prisma.lesson.findUnique({
      where: {
         id: lessonId,
      },
      select: {
         id: true,
         title: true,
         description: true,
         thumbnailKey: true,
         videoKey: true,
         position: true,
         lessonProgress: {
            where: {
               userId: session.id,
            },select: {
               completed: true,
               lessonId: true,
            }
         },
         Chapter: {
            select: {
               courseId: true,
               Course:{
                  select: {
                     slug: true,
                  }
               }
            }
         }
      }
   });

   if (!lesson) {
      throw new Error("Lesson not found");
   }

   const enrollment = await prisma.enrollment.findUnique({
      where: {
         userId_courseId: {
            userId: session.id,
            courseId: lesson.Chapter.courseId,
         },
      },
      select: {
         status: true,
      }
   });

   if (!enrollment || enrollment.status !== "Active") {
      throw new Error("User is not enrolled in the course for this lesson");
   }

   return lesson;
}

export type LessonContentType = Awaited<ReturnType<typeof getLessonContent>>;