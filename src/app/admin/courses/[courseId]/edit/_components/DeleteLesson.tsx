import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import { Trash2, XIcon } from "lucide-react";
import { useState, useTransition } from "react";
import { deleteLesson } from "../actions";
import { toast } from "sonner";

export function DeleteLesson({
    chapterId,
    courseId,
    lessonId,
}: {
    chapterId: string;
    courseId: string;
    lessonId: string;
}) {

    const [pending, startTransition] = useTransition();
    const [open, setOpen] = useState(false);

    async function onSubmit() {
        startTransition(async () => {
            const {data: result, error} = await tryCatch(deleteLesson({chapterId, courseId, lessonId}));

            if(error) {
                toast.error("An unexpected error occurred. Please try again.");
                return;
            }

            if(result.status === "success") {
                toast.success(result.message);
                setOpen(false);
            } else if (result.status === "error") {
                toast.error(result.message);
            }
        })
    }

    return(
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Trash2 className="size-4 text-destructive hover:cursor-pointer" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure you want to delete this lesson?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This lesson will be deleted permanently and can not be recovered.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>
                        <XIcon className="size-4" /> Cancel
                    </AlertDialogCancel>
                    <Button onClick={onSubmit} disabled={pending}>
                        <Trash2 className="size-4" />{pending ? "Deleting..." : "Delete"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}