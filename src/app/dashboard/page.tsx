
import { EmptyState } from "@/components/general/EmptyState";
import { GetAllCourses } from "../data/course/get-all-courses"
import { getEnrolledCourses } from "../data/user/get-enrolled-courses"
import { CourseProgressCard } from "./_components/CourseProgressCard";

export default async function DashboardPage() {
   const [enrolledCourses] = await Promise.all([getEnrolledCourses(), GetAllCourses()]);
   return (
      <>
      <div className="flex flex-col gap-2 mb-3">
         <h1 className="text-primary text-3xl font-semibold">Enrolled Courses</h1>
         <p className="text-muted-foreground text-sm mt-2">You have enrolled in {enrolledCourses.length} courses.</p>
      </div>

         {enrolledCourses.length === 0 ? (
            <EmptyState title="No course purchased." description="You dont have any enrolled or purchased course kindly purchase one" buttonText="Browse Courses" href="/dashboard/courses"/>
         ) : (
            <div className="hidden md:grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
               {enrolledCourses.map((course) => (
                  <CourseProgressCard key={course.Course.id} data={course} />
               ))}
            </div>
         )}
      </>
   )
}