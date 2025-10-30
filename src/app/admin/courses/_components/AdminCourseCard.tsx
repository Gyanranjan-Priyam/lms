import { AdminCoursesType } from "@/app/data/admin/admin-get-courses";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useConstructUrl } from "@/hooks/use-construct";
import { ArrowRight, Eye, MoreVertical, Pencil, School2, TimerIcon, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface iAppProps {
    data: AdminCoursesType;
}

export function AdminCourseCard({data}: iAppProps) {
    const ThumbNailUrl = useConstructUrl(data.fileKey);
    return (
        <Card className="group relative py-0 gap-0">
            <div className="absolute top-2 right-2 z-10">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon">
                            <MoreVertical className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem>   
                            <Link href={`/admin/courses/${data.id}/edit`} className={buttonVariants({variant: "ghost", className: "justify-start w-full"})}>
                                <Pencil className="size-4 mr-2"/>Edit Course
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>   
                            <Link href={`/courses/${data.slug}`} className={buttonVariants({variant: "ghost", className: "justify-start w-full"})}>
                                <Eye className="size-4 mr-2"/>Preview
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>   
                            <Link href={`/admin/courses/${data.id}/delete`} className={buttonVariants({variant: "ghost", className: "justify-start w-full"})}>
                                <Trash className="size-4 mr-2 text-red-500"/>
                                <p className="text-red-500">Delete Course</p>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
                <Image src={ThumbNailUrl} alt="Thumbnail URL" width={600} height={400}
                className="w-full rounded-t-lg aspect-video h-full object-cover"/>
            <CardContent className="p-4">
                <Link href={`/admin/courses/${data.id}`} 
                className="font-medium text-lg hover:underline line-clamp-2 group-hover:text-primary transition-colors">
                    {data.title}
                </Link>
                <p className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-2">
                    {data.smallDescription}
                </p>
                <div className="mt-4 flex items-center gap-x-5">
                    <div className="flex items-center gap-x-2">
                    <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
                    <p className="text-sm text-muted-foreground">{data.duration} Hours</p>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <School2 className="size-6 p-1 rounded-md text-primary bg-primary/10" />
                        <p className="text-sm text-muted-foreground">{data.level}</p>
                    </div>
                </div>
                <div className="mx-auto flex items-center justify-center">
                    <Link href={`/admin/courses/${data.id}/edit`} className={buttonVariants({className:"mx-auto mt-4 w-full"})}>
                        Edit Course <ArrowRight className="size-6 p-1 rounded-md" />
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}

export function AdminCourseCardSkeleton() {
    return (
    <Card className="group-relative py-0 gap-0">
        <div className="w-full relative h-fit">
            <Skeleton className="w-full rounded-t-lg aspect-video h-[250px] object-cover" />
        </div>
        <CardContent className="p-4">
            <Skeleton className="h-6 w-3/4 mb-2 rounded-md" />
            <Skeleton className="h-4 w-full mb-4 rounded-md" />
            <div className="flex items-center gap-x-5 mt-4">
                <div className="flex items-center gap-x-2">
                    <Skeleton className="size-6 rounded-md" />
                    <Skeleton className="h-4 w-10 rounded-md" />
                </div>
                <div className="flex items-center gap-x-2">
                    <Skeleton className="size-6 rounded-md" />
                    <Skeleton className="h-4 w-10 rounded-md" />
                </div>
            </div>
            <Skeleton className="mt-4 h-10 w-full rounded-md" />
        </CardContent>
    </Card>
)}