import { PublicCourseCard } from "@/app/(public)/_components/PublicCourseCard";
import { GetAllCourses } from "@/app/data/course/get-all-courses";
import { getEnrolledCourses } from "@/app/data/user/get-enrolled-courses";
import { EmptyState } from "@/components/general/EmptyState";

export default async function UserCoursesPage() {
   const [enrolledCourses, courses] = await Promise.all([getEnrolledCourses(), GetAllCourses()]);
   return (
      <>
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