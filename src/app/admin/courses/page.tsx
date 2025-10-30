import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { adminGetCourses } from "@/app/data/admin/admin-get-courses";
import { AdminCourseCard, AdminCourseCardSkeleton } from "./_components/AdminCourseCard";
import { EmptyState } from "@/components/general/EmptyState";
import { Suspense } from "react";
import { Plus } from "lucide-react";

export default function CoursesPage() {

    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">
                    Your Courses
                </h1>
                
                <Link href="/admin/courses/create" className={buttonVariants()}>
                    <Plus className="size-4 mr-2" />
                    Create Course
                </Link>
            </div>
            <Suspense fallback={<AdminCourseCardSkeletonLayout />}>
                <RenderCourses />
            </Suspense>
        </>
    )
}

async function RenderCourses() {
    const data = await adminGetCourses();
    return (
        <>
        {data.length === 0 ? (
                <EmptyState 
                    title="No Courses Found" 
                    description="It looks like you haven't created any courses yet. Start by creating a new course to manage your content." 
                    buttonText="Create Course"
                    href="/admin/courses/create"
                />
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7">
                {data.map((course)=>(
                    <AdminCourseCard key={course.id} data={course} />
                ))}
            </div>
            )}
        </>
    )
}

function AdminCourseCardSkeletonLayout() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7">
            {Array.from({length: 4}).map((_, index) => (
                <AdminCourseCardSkeleton key={index} />
            ))}
        </div>
    )
}