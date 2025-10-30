"use client";

import { EnrolledCourseType } from "@/app/data/user/get-enrolled-courses";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useConstructUrl } from "@/hooks/use-construct";
import { useCourseProgress } from "@/hooks/use-course-progress";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface iAppProps {
   data: EnrolledCourseType;
}

export function CourseProgressCard({ data }: iAppProps) {
   const thumbnailUrl = useConstructUrl(data.Course.fileKey);
   const { totalLessons, completedLessons, progressPercentage } = useCourseProgress({ courseData: data.Course });
   return (
      <Card className="group relative py-0 gap-0">
         <Badge className="absolute top-2 right-2 z-10">{data.Course.level}</Badge>
         <Image width={600} height={400} className="w-full rounded-t-xl aspect-video h-full object-cover" src={thumbnailUrl} alt="Thumbnail Image of Course"/>
         <CardContent className="p-4">
            <Link href={`/dashboard/${data.Course.slug}`} className="font-medium text-lg line-clamp-2 group-hover:text-primary">
               {data.Course.title}
            </Link>
            <p className="line-clamp-2 text-sm text-muted-foreground mt-2 leading-tight">
               {data.Course.smallDescription}
            </p>
            <div className="space-y-4">
               <div className="flex justify-between mb-1 text-sm">
                  <p>Progress : </p>
                  <p className="font-medium">{progressPercentage}%</p>
               </div>
               <Progress value={progressPercentage} className="h-2.5 bg-muted mt-4 mb-2 rounded-full"/>

               <p className="text-sm font-medium text-muted-foreground mt-4 mb-1 text-center">{completedLessons} of {totalLessons} Lessons Completed</p>
            </div>
            <Link href={`/dashboard/${data.Course.slug}`} className={buttonVariants({ className: "mt-4 w-full" })}> Learn More<ArrowRight className="size-4"/></Link>
         </CardContent>
      </Card>
   )
}

export function PublicCourseCardSkeleton() {
   return (
      <Card className="group relative py-0 gap-0">
         <div className="absolute top-2 right-2 z-10 flex items-center">
            <Skeleton className="h-6 rounded-full" />
         </div>
         <div className="w-full relative h-fit">
            <Skeleton className="w-full rounded-t-xl aspect-video"/>
         </div>
         <CardContent className="p-4">
            <div className="space-y-2">
               <Skeleton className="h-6 w-full" />
               <Skeleton className="h-6 w-3/4" />
            </div>
            <div className="mt-4 flex items-center gap-x-5">
               <div className="flex items-center gap-x-2">
                  <Skeleton className="size-6 rounded-md" />
                  <Skeleton className="h-4 w-8"/>
               </div>
               <div className="flex items-center gap-x-2">
                  <Skeleton className="size-6 rounded-md" />
                  <Skeleton className="h-4 w-8"/>
               </div>
            </div>
            <Skeleton className="mt-4 w-full h-10 rounded-md"/>
         </CardContent>
      </Card>
   )
}