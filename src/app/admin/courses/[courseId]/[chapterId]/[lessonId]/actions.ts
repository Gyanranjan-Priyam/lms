"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { lessonSchema, LessonSchemaType } from "@/lib/zodSchema";

export async function updateLesson(values: LessonSchemaType, lessonId: string): Promise<ApiResponse> {
   await requireAdmin();

   try {
      const result = lessonSchema.safeParse(values);
      if (!result.success) {
         return {
            status: "error",
            message: "Invalid input data",
         }
      }

      // Use a transaction to update lesson and documents atomically
      await prisma.$transaction(async (tx) => {
         // Update the lesson
         await tx.lesson.update({
            where: {
               id: lessonId,
            },
            data: {
               title: result.data.name,
               description: result.data.description,
               videoKey: result.data.videoKey,
               thumbnailKey: result.data.thumbnailKey,
            }
         });

         // Delete existing documents
         await tx.lessonDocument.deleteMany({
            where: {
               lessonId: lessonId,
            }
         });

         // Create new documents if provided
         if (result.data.documents && result.data.documents.length > 0) {
            await tx.lessonDocument.createMany({
               data: result.data.documents.map((doc, index) => ({
                  name: doc.name,
                  fileKey: doc.fileKey,
                  position: index,
                  lessonId: lessonId,
               }))
            });
         }
      });

      return {
         status: "success",
         message: "Lesson updated successfully",
      }
   } catch {
      return {
         status: "error",
         message: "Failed to update lesson",
      }
   }
}