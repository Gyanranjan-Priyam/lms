"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { tryCatch } from "@/hooks/try-catch";
import { Loader2, Trash2, XIcon } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { DeleteCourse } from "./actions";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function DeleteCourseRoute() {

   const[pending, startTransition] = useTransition();
   const { courseId } = useParams<{courseId: string}>();
   const router = useRouter();

   function onSubmit() {
    startTransition(async () =>{
      const{data: result, error} = await tryCatch(DeleteCourse(courseId));

      if(error) {
        toast.error("An unexpected error occured. Please try again.");
        return ;
      }
      if (result.status === 'success') {
        toast.success(result.message);
        router.push("/admin/courses");
      }
      else if(result.status === 'error'){
        toast.error(result.message)
      }
    });
  }

   return (
      <div className="max-w-xl mx-auto w-full items-center justify-center">
         <Card className="mt-32">
            <CardHeader>
               <CardTitle className="text-center text-2xl md:text-3xl text-primary font-bold ">
                  Are you sure you want to delete this course?
               </CardTitle>
               <CardDescription className="text-center mt-2 text-lg ">
                  Once the course is deleted, all of its resources and data will be permanently removed. This action cannot be undone.
               </CardDescription>
            </CardHeader>
            <CardContent className="gap-2 flex flex-row justify-center">
               <Link href="/admin/courses" className={buttonVariants({ variant: "outline", className: "mr-4" })}>
                  <XIcon className="size-4" /> Cancel
               </Link>
               <Button variant="destructive" className="bg-red-600 text-white cursor-pointer hover:bg-red-700" onClick={onSubmit} disabled={pending}>
                  {pending ? (
                     <>
                        <Loader2 className="size-4 animate-spin mr-2" /> Deleting...
                     </>) : (
                        <>
                           <Trash2 className="size-4" /> Delete Course
                        </>
                     )}
               </Button>
            </CardContent>
         </Card>
      </div>
   )
}