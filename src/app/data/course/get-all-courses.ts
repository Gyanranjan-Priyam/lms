import "server-only";
import { prisma } from "@/lib/db";

export async function GetAllCourses() {
   const data =  await prisma.course.findMany({
      where: {
         status: "Published",
      },
      orderBy:{
         createdAt: "desc",
      },
      select: {
         title: true,
         price: true,
         smallDescription: true,
         duration: true,
         slug: true,
         fileKey: true,
         id: true,
         level: true,
         category: true,
      }
   })
   return data;
}


export type PublicCourseType = Awaited<ReturnType<typeof GetAllCourses>>[0];