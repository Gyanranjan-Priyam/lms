import { adminGetCourse } from "@/app/data/admin/admin-get-course";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditorCourseForm } from "./_components/EditorCourseForm";
import { CourseStructure } from "./_components/CourseStructure";

type Params = Promise<{ courseId: string }>;

export default async function EditRoute({params} : {params: Params}) {

    const {courseId} = await params;
    const data = await adminGetCourse(courseId);
    return (
        <div>
           <h1 className="text-3xl font-bold mb-8">
            Edit Course: 
            <span className="text-primary">
                &nbsp;{data.title}
            </span> 
           </h1>
           <Tabs defaultValue="basic-info" className="w-full">
            <TabsList className="grid grid-cols-2 w-100 mx-auto mb-6 rounded-lg p-1 h-auto">
                <TabsTrigger value="basic-info" className=" cursor-pointer">
                    Basic Information
                </TabsTrigger>
                <TabsTrigger value="course-structure" className=" cursor-pointer">
                    Course Structure
                </TabsTrigger>
            </TabsList>
            <TabsContent value="basic-info">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Basic Information
                        </CardTitle>
                        <CardDescription>
                            Provide basic information about the course.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <EditorCourseForm data={data} />
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="course-structure">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Course Structure
                        </CardTitle>
                        <CardDescription>
                            Here you can manage the course structure, lessons, and modules.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CourseStructure data={data} />
                    </CardContent>
                </Card>
            </TabsContent>
           </Tabs>
        </div>
    )
}