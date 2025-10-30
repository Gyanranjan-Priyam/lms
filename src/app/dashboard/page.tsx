
import { EmptyState } from "@/components/general/EmptyState";
import { GetAllCourses } from "../data/course/get-all-courses"
import { getEnrolledCourses } from "../data/user/get-enrolled-courses"
import { PublicCourseCard } from "../(public)/_components/PublicCourseCard";
import { CourseProgressCard } from "./_components/CourseProgressCard";

export default async function DashboardPage() {
   const [enrolledCourses, courses] = await Promise.all([getEnrolledCourses(), GetAllCourses()]);
   return (
      <>
      <div className="flex flex-col gap-2 mb-3">
         <h1 className="text-primary text-3xl font-semibold">Enrolled Courses</h1>
         <p className="text-muted-foreground text-sm mt-2">You have enrolled in {enrolledCourses.length} courses.</p>
      </div>

         {enrolledCourses.length === 0 ? (
            <EmptyState title="No course purchased." description="You dont have any enrolled or purchased course kindly purchase one" buttonText="Browse Courses" href="/courses"/>
         ) : (
            <div className="hidden md:grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
               {enrolledCourses.map((course) => (
                  <CourseProgressCard key={course.Course.id} data={course} />
               ))}
            </div>
         )}

         <section className="mt-10 mb-30">
            <div className="flex flex-col gap-2 mb-3">
               <h1 className="text-primary text-3xl font-semibold">Available Courses</h1>
               <p className="text-muted-foreground text-sm mt-2">Available courses that you can purchase.</p>
            </div>
            {courses.filter(
               (course) => !enrolledCourses.some(
                  (enrollment) => enrollment.Course.id === course.id
               )
            ).length === 0 ? (
               <EmptyState title="No available courses." description="You have enrolled in all available courses." buttonText="Browse Courses" href="/courses"/>
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