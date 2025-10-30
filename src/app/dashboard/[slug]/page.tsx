import { getIndividualCourse } from "@/app/data/course/get-course";
import { checkIfCourseBought } from "@/app/data/user/user-is-enrolled";
import { RenderDescription } from "@/components/rich-text-editor/RenderDescription";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { useConstructUrl } from "@/hooks/use-construct";
import { IconCategory, IconChartBar, IconChevronDown, IconClock, IconPlayerPlay } from "@tabler/icons-react";
import Image from "next/image";


type Params = Promise<{ slug: string }>;

function ThumbNailUrl(fileKey: string) {
   const url = useConstructUrl(fileKey);
   return url;
}


export default async function DashboardSlugPage({ params }: { params: Params }) {

   const { slug } = await params;
      const course = await getIndividualCourse(slug);
      const thumbnailUrl = ThumbNailUrl(course.fileKey!);      
   return (
      <div className="order-1 lg:col-span-2">
            <div className="relative aspect-video w-full rounded-xl overflow-hidden">
               <Image src={thumbnailUrl} alt={course.title} layout="responsive" width={500} height={300} className="object-cover" priority/>
               <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
            <div className="mt-8 space-y-6">
               <div className="space-y-4">
                  <h1 className="text-4xl text-primary font-bold tracking-tight">{course.title}</h1>
                  <p className="mt-2 text-muted-foreground leading-relaxed line-clamp-2">{course.smallDescription}</p>
               </div>
               <div className="flex flex-wrap gap-3">
                  <Badge className="flex items-center gap-2 px-4 py-2 font-medium">
                     <IconChartBar /> {course.level}
                  </Badge>
                  <Badge className="flex items-center gap-2 px-4 py-2 font-medium">
                     <IconClock /> {course.duration} Hours
                  </Badge>
                  <Badge className="flex items-center gap-2 px-4 py-2 font-medium">
                     <IconCategory /> {course.category}
                  </Badge>
               </div>
               <Separator className="my-8"/>
               <div className="space-y-6">
                  <h2 className="text-3xl font-semibold tracking-tight">Course Description</h2>
                     <RenderDescription json={JSON.parse(course.description)} />  
               </div>
            </div>
            <div className="mt-12 space-y-6">
               <div  className="flex items-center justify-between">
                  <h2 className="text-3xl font-semibold tracking-tight">
                     Course Content
                  </h2>
                  <div>
                     {course.chapter.length} chapters - {course.chapter.reduce((total, chapter) => total + chapter.lessons.length, 0) || 0} lessons
                  </div>
               </div>
            </div>
            <div className="mt-4 space-y-4">
               {course.chapter.map((chapter, index) => (
                  <Collapsible key={chapter.id} defaultOpen={index === 0}>
                     <Card className="p-0 overflow-hidden border-2 transition-all duration-200 hover:shadow-md gap-0">
                        <CollapsibleTrigger>
                           <div>
                              <CardContent className="p-6 hover:bg-muted/50 transition-colors">
                                 <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                       <p className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
                                          {index + 1}
                                       </p>
                                       <div>
                                          <h3 className="text-xl font-semibold text-left">{chapter.title}</h3>
                                          <p className="text-sm text-muted-foreground mt-1 text-left">
                                             {chapter.lessons.length} lesson{chapter.lessons.length !== 1 ? "s" : ""}
                                          </p>
                                       </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                       <Badge variant="outline" className="px-3 py-1 font-medium">
                                          {chapter.lessons.length} lesson{chapter.lessons.length !== 1 ? "s" : ""}
                                       </Badge>
                                       <IconChevronDown className="size-5 text-muted-foreground"/>
                                    </div>
                                 </div>
                              </CardContent>
                           </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                           <div className="border-t rounded-b-lg bg-muted/20">
                              <div className="p-6 pt-4 space-y-3">
                                 {chapter.lessons.map((lesson, lessonIndex) => (
                                    <div key={lesson.id} className="flex items-center gap-4 rounded-lg p-3 hover:bg-muted/50 transition-colors group cursor-pointer">
                                       <div className="flex size-8 items-center rounded-full bg-primary/20 justify-center border-primary/20 border-2">
                                          <IconPlayerPlay className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                       </div>
                                       <div className="flex-1">
                                          <p className="font-medium text-sm">{lesson.title}</p>
                                          <p className="text-xs text-muted-foreground mt-1">Lesson {lessonIndex + 1}</p>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </CollapsibleContent>
                     </Card>
                  </Collapsible>
               ))}
            </div>
         </div>
   )
}