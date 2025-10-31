import { GetAllCourses } from "@/app/data/course/get-all-courses"
import { PublicCourseCard, PublicCourseCardSkeleton } from "../_components/PublicCourseCard";
import { Suspense } from "react";
import { EmptyStateCourse } from "@/components/general/EmptyState";
import { getEnrolledCourses } from "@/app/data/user/get-enrolled-courses";



export default function PublicCourses() {
   return (
      <div className="mt-5">
         <div className="flex flex-col space-y-2 mb-10">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">
             Explore Courses
            </h1>
            <p className="text-muted-foreground">Discover a variety of courses to enhance your skills and knowledge.</p>
         </div>
         <Suspense fallback={loadingSkeletonLayout()}>
            <RenderCourses />
         </Suspense>
      </div>
   )
}

async function RenderCourses() {
      const [enrolledCourses, courses] = await Promise.all([getEnrolledCourses(), GetAllCourses()]);
   return (
      <>
               <section className="mt-10 mb-30">
                           {courses.filter(
                              (course) => !enrolledCourses.some(
                                 (enrollment) => enrollment.Course.id === course.id
                              )
                           ).length === 0 ? (
                              <EmptyStateCourse title="No available courses." description="There is no new courses added by the admin. Kindly contact admin." buttonText="Contact Admin" href="/contact-us"/>
                           ) : (
                              <div className="flex flex-col gap-2 mb-3">
                                 {courses.filter(
                              (course) => !enrolledCourses.some(
                                 (enrollment) => enrollment.Course.id === course.id
                              )).map((course) => (
                                 <PublicCourseCard key={course.id} data={course} />
                              ))}
                              </div>
                           )}
                        </section> 
            </>
   )
}
function loadingSkeletonLayout() {
   return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {Array.from({ length: 6 }).map((_, index) => (
            <PublicCourseCardSkeleton key={index} />
         ))}
      </div>
   )
}
