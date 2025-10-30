"use client";

import { AdminLessonType } from "@/app/data/admin/admin-get-lesson";
import { Uploader } from "@/components/file-uploader/Uploader";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { tryCatch } from "@/hooks/try-catch";
import {  lessonSchema, LessonSchemaType } from "@/lib/zodSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader, Save } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateLesson } from "../actions";

interface iAppProps {
    data: AdminLessonType;
    chapterId: string;
    courseId: string;
}

export function LessonForm({data, chapterId, courseId}: iAppProps) {
    const [pending, startTransition] = useTransition();
    const form = useForm<LessonSchemaType>({
        resolver: zodResolver(lessonSchema),
        defaultValues: {
            name: data.title,
            chapterId: chapterId,
            courseId: courseId,
            description: data.description ?? undefined,
            videoKey: data.videoKey ?? undefined,
            thumbnailKey: data.thumbnailKey ?? undefined,
        },
    });

    function onSubmit(values: LessonSchemaType) {
    startTransition(async () =>{
      const{data: result, error} = await tryCatch(updateLesson(values, data.id));

      if(error) {
        toast.error("An unexpected error occured. Please try again.");
        return ;
      }
      if (result.status === 'success') {
        toast.success(result.message);
      }
      else if(result.status === 'error'){
        toast.error(result.message)
      }
    });
  }
    return (
        <div>
            <Link href={`/admin/courses/${courseId}/edit`}>
                <Button variant="outline" className="mb-4 gap-2 cursor-pointer">
                    <ArrowLeft className="size-4" />
                    <span>Go Back</span>
                </Button>
                </Link>
                <Card>
                    <CardHeader>
                        <CardTitle>Edit Lessons Content</CardTitle>
                        <CardDescription>
                            Add all the necessary content to your lesson such as videos, texts, quizzes, and more.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                    {/* This is the Lesson title section */}
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Lesson Title</FormLabel>
                                            <FormControl className="mt-2">
                                                <Input placeholder="Lesson Name" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}/>

                                    {/* This is the description section */}
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Lesson Description</FormLabel>
                                            <FormControl className="mt-2">
                                                <RichTextEditor field={field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}/>
                                
                                {/* This is thumbnail key section */}
                                <FormField
                                    control={form.control}
                                    name="thumbnailKey"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Thumbnail Image</FormLabel>
                                            <FormControl className="mt-2">
                                                <Uploader onChange={field.onChange} value={field.value} fileTypeAccepted="image"/>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}/>

                                {/* This is video key section */}
                                <FormField
                                    control={form.control}
                                    name="videoKey"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Video File</FormLabel>
                                            <FormControl className="mt-2">
                                                <Uploader onChange={field.onChange} value={field.value} fileTypeAccepted="video"/>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}/>
                                    <Button type="submit" disabled={pending} className="mt-4">
                                        {pending ? (
                                            <>
                                                <Loader className="size-4 animate-spin mr-2" /> Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="size-4 mr-2" /> Save Lesson
                                            </>
                                        )}
                                    </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
        </div>
    )
}