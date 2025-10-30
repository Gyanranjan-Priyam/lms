import { getIndividualCourse } from "@/app/data/course/get-course";
import { checkIfCourseBought } from "@/app/data/user/user-is-enrolled";
import { RenderDescription } from "@/components/rich-text-editor/RenderDescription";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import {  buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { useConstructUrl } from "@/hooks/use-construct";
import { IconBook, IconCategory, IconChartBar, IconChevronDown, IconClock, IconPlayerPlay } from "@tabler/icons-react";
import { CheckIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { EnrollmentButton } from "./_components/EnrollmentButton";

type Params = Promise<{ slug: string }>;

function ThumbNailUrl(fileKey: string) {
   const url = useConstructUrl(fileKey);
   return url;
}

export default async function SlugPage({ params }: { params: Params }) {

   const { slug } = await params;
   const course = await getIndividualCourse(slug);
   const thumbnailUrl = ThumbNailUrl(course.fileKey!);

   const isEnrolled = await checkIfCourseBought(course.id);

   return (
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 mt-5">
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
         {/* Enrollment Card */}
         <div className="order-2 lg:col-span-1">
            <div className="sticky top-20">
               <Card className="py-0">
                  <CardContent className="p-6">
                     <div className="flex items-center justify-between">
                        <span className="text-lg font-medium">
                           Price:
                        </span>
                        <span className="text-2xl text-primary font-bold">
                           {course.price === 0 ? "Free" : new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: "INR",
                           }).format(course.price)}
                        </span>
                     </div>
                     <div className="mb-6 mt-6 space-y-3 rounded-lg p-4 bg-muted/80">
                        <h4 className="mt-1 font-medium">
                           What will you get?
                        </h4>
                        <div className="flex flex-col gap-3">
                           <div className="flex items-center gap-3">
                              <div className="mt-1 flex items-center size-8 bg-primary/10 rounded-full justify-center text-primary">
                                 <IconClock className="size-4" />
                              </div>
                              <div>
                                 <p className="text-sm font-medium">Course Duration</p>
                                 <p className="text-sm text-muted-foreground">{course.duration} hours</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-3">
                              <div className="mt-1 flex items-center size-8 bg-primary/10 rounded-full justify-center text-primary">
                                 <IconChartBar className="size-4" />
                              </div>
                              <div>
                                 <p className="text-sm font-medium">Difficulty Level</p>
                                 <p className="text-sm text-muted-foreground">{course.level}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-3">
                              <div className="mt-1 flex items-center size-8 bg-primary/10 rounded-full justify-center text-primary">
                                 <IconBook className="size-4" />
                              </div>
                              <div>
                                 <p className="text-sm font-medium">Total Lessons</p>
                                 <p className="text-sm text-muted-foreground">{course.chapter.reduce((total, chapter) => total + chapter.lessons.length, 0) || 0} lessons</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-3">
                              <div className="mt-1 flex items-center size-8 bg-primary/10 rounded-full justify-center text-primary">
                                 <IconCategory className="size-4" />
                              </div>
                              <div>
                                 <p className="text-sm font-medium">Course Category</p>
                                 <p className="text-sm text-muted-foreground">{course.category}</p>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="mb-6 space-y-3">
                        <h4>This Course Includes:</h4>
                        <ul className="space-y-2">
                           <li className="flex items-center gap-2 text-sm">
                              <div className="w-6 h-6 p-1 flex items-center justify-center rounded-full bg-green-500/10 text-green-500">
                                 <CheckIcon className="size-4" />
                              </div>
                              <span className="text-md">Full access to all course materials for lifetime. </span>
                           </li>
                           <li className="flex items-center gap-2 text-sm">
                              <div className="w-6 h-6 p-1 flex items-center justify-center rounded-full bg-green-500/10 text-green-500">
                                 <CheckIcon className="size-4" />
                              </div>
                              <span className="text-md">Certificate of Completion</span>
                           </li>
                           <li className="flex items-center gap-2 text-sm">
                              <div className="w-6 h-6 p-1 flex items-center justify-center rounded-full bg-green-500/10 text-green-500">
                                 <CheckIcon className="size-4" />
                              </div>
                              <span className="text-md"> Easily accessible on any device. </span>
                           </li>
                           <li className="flex items-center gap-2 text-sm">
                              <div className="w-6 h-6 p-1 flex items-center justify-center rounded-full bg-green-500/10 text-green-500">
                                 <CheckIcon className="size-4" />
                              </div>
                              <span className="text-md"> Fundamental concepts covered with real-world examples. </span>
                           </li>
                        </ul>
                     </div>
                     {isEnrolled ? (
                        <Link href="/dashboard" className={buttonVariants({className: "w-full justify-center"})}>
                           Watch Course
                        </Link>
                     ) : (
                        <EnrollmentButton courseId={course.id} />
                     )}
                     <p className="mt-3 text-center text-xs text-muted-foreground">30 days money-back guarantee</p>
                  </CardContent>
               </Card>
               <Card className="mt-6 p-6">
                  <CardHeader>
                     <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
                  </CardHeader>
                  <CardContent>
                     <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                           <AccordionTrigger>What is the refund policy?</AccordionTrigger>
                           <AccordionContent>
                              <p>If you are not satisfied with the course, you can request a refund within 30 days of purchase.</p>
                           </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-2">
                           <AccordionTrigger>How long do I have access to the course?</AccordionTrigger>
                           <AccordionContent>
                              <p>You will have lifetime access to the course materials.</p>
                           </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="item-3">
                           <AccordionTrigger>Is prior experience required?</AccordionTrigger>
                           <AccordionContent>
                              <p>No prior experience is required to enroll in this course.</p>
                           </AccordionContent>
                        </AccordionItem>
                     </Accordion>
                  </CardContent>
               </Card>
            </div>
         </div>
      </div>
   )
}