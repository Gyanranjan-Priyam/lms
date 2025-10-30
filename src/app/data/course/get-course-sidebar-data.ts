import "server-only";
import { requireUser } from "../user/require-user";
import { prisma } from "@/lib/db";

export async function getCourseSidebarData(slug: string) {
   const session = await requireUser();

   const course = await prisma.course.findFirst({
      where: {
         slug: slug,
      },
      select: {
         id: true,
         title: true,
         fileKey: true,
         category: true,
         level: true,
         duration: true,
         slug: true,
         chapter: {
            orderBy: { position: 'asc' },
            select: {
               id: true,
               title: true,
               position: true,
               lessons: {
                  orderBy: { position: 'asc' },
                  select: {
                     id: true,
                     title: true,
                     position: true,
                     description: true,
                     lessonProgress: {
                        where: {
                           userId: session.id,
                        },
                        select: {
                           completed: true,
                           lessonId: true,
                        }
                     }
                  }
               }
            }
         }
      }
   })

   if (!course) {
      throw new Error("Course not found");
   }

   const enrollment = await prisma.enrollment.findUnique({
      where: {
         userId_courseId: {
            userId: session.id,
            courseId: course.id,
         }
      }
   });

   if (!enrollment) {
      throw new Error("User is not enrolled in this course");
   }

   return {
      course,
      enrollment,
   };
}

export type CourseSidebarDataType = Awaited<ReturnType<typeof getCourseSidebarData>>;