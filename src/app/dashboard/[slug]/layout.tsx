import { CourseSidebar } from "../_components/CourseSidebar";
import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";

interface iAppProps {
   params: Promise<{ slug: string }>;
   children: React.ReactNode;
}

export default async function DashboardSlugLayout({ children, params }: iAppProps) {

   const {slug} = await params;

   const course = await getCourseSidebarData(slug);

   return (
      <div className="flex flex-1">

         <div className="w-80 border-right border-border shrink-0 sticky top-0 h-screen overflow-y-auto">
            {/* Sidebar content can go here */}
            <CourseSidebar course={course.course} />
         </div>

         <div className="flex-1 overflow-hidden">
            {children}
         </div>
      </div>
   )
}