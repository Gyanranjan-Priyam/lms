"use client";

import { Button } from "@/components/ui/button";
import {
  courseCategories,
  courseSchema,
  CourseSchemaType,
  courseLevel,
  courseStatus,
} from "@/lib/zodSchema";
import { Loader2, Plus, SparkleIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import slugify from "slugify";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { Uploader } from "@/components/file-uploader/Uploader";
import { useTransition } from "react";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { editCourse } from "../actions";
import { AdminGetCourseSingularType } from "@/app/data/admin/admin-get-course";

interface iAppProps {
    data: AdminGetCourseSingularType
}

export function EditorCourseForm({data} : iAppProps) {
      const [pending, startTransition] = useTransition();
      const router = useRouter();

      const form = useForm<CourseSchemaType>({
        resolver: zodResolver(courseSchema) as any,
        defaultValues: {
          title: data.title,
          description: data.description,
          fileKey: data.fileKey,
          price: data.price,
          duration: data.duration,
          level: data.level,
          category: data.category as CourseSchemaType["category"],
          smallDescription: data.smallDescription,
          slug: data.slug,
          status: data.status,
        },
      });

        function onSubmit(values: CourseSchemaType) {
    startTransition(async () =>{
      const{data: result, error} = await tryCatch(editCourse(values, data.id));

      if(error) {
        toast.error("An unexpected error occured. Please try again.");
        return ;
      }
      if (result.status === 'success') {
        toast.success(result.message);
        form.reset()
        router.push("/admin/courses");
      }
      else if(result.status === 'error'){
        toast.error(result.message)
      }
    });
  }

    return (
        <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              {/* Form Fields will go here */}
              <FormField
                control={form.control as any}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input className="mt-2" {...field} placeholder="Title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>

              {/* This is the slug section */}
              <div className="flex items-end gap-4">
                <FormField
                  control={form.control as any}
                  name="slug"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input className="mt-2" {...field} placeholder="Slug" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                <Button
                  type="button"
                  className="w-fit"
                  onClick={() => {
                    const titleValue = form.getValues("title");
                    const slug = slugify(titleValue);
                    form.setValue("slug", slug, { shouldValidate: true });
                  }}
                >
                  Generate Slug <SparkleIcon className="ml-1" size={16} />
                </Button>
              </div>

              {/* This is the small description section */}
              <FormField
                control={form.control as any}
                name="smallDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Small Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Small Description"
                        className="min-h-[70px] mt-2"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>

              {/* This is the description section */}
              <FormField
                control={form.control as any}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                        <RichTextEditor field={field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>

              {/* This is image upload section */}
              <FormField
                control={form.control as any}
                name="fileKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail Image</FormLabel>
                    <FormControl>
                        <Uploader onChange={field.onChange} value={field.value} fileTypeAccepted="image"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>

              {/* This is category section. */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control as any}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full mt-2">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {courseCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>

                {/* This is level section. */}
                <FormField
                  control={form.control as any}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Level</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full mt-2">
                            <SelectValue placeholder="Select Level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {courseLevel.map((level) => (
                            <SelectItem key={level} value={level}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
              </div>

              {/* This is price and duration section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control as any}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mt-2">Price (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" className="mt-2.5" placeholder="price" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                control={form.control as any}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mt-2">Duration (in hours)</FormLabel>
                    <FormControl>
                      <Input type="number" className="mt-2.5" placeholder="duration" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              </div>

              {/* This is status section */}
              <FormField
                  control={form.control as any}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="mt-2">Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full mt-2">
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {courseStatus.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>

                <Button type="submit" disabled={pending}>
                    {pending ? 
                    (<>
                      Updating....
                      <Loader2 className="animate-spin ml-1"/>
                    </>) : (
                      <>
                        Update Course <Plus className="ml-1 size-5"/>
                      </>
                    )}
                </Button>
            </form>
          </Form>
    )
}