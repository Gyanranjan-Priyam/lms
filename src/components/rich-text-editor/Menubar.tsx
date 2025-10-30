import { type Editor } from "@tiptap/react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Toggle } from "../ui/toggle";
import { AlignCenter, AlignLeft, AlignRight, Bold, Heading1, Heading2, Heading3, Italic, ListIcon, ListOrderedIcon, Redo, Strikethrough, Undo } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

interface iAppProps {
    editor: Editor | null;
}

export function Menubar({ editor }: iAppProps) {

    if(!editor) {
        return null;
    }
    return (
        <div className=" border border-t-0 border-r-0 border-l-0 border-b-input rounded-t-lg p-2 flex flex-wrap gap-1 items-center bg-muted-foreground/10 dark:bg-muted/20">
            <TooltipProvider>
                <div className="flex flex-wrap gap-1">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle 
                            size="sm" 
                            pressed={editor.isActive("bold")} 
                            onPressedChange={() => editor.chain().focus().toggleBold().run()}
                            className={cn(editor.isActive("bold") && "bg-green-200/20 text-green-400")}>
                                <Bold />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            Bold
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle 
                            size="sm" 
                            pressed={editor.isActive("italic")} 
                            onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                            className={cn(editor.isActive("italic") && "bg-green-200/20 text-green-400")}>
                                <Italic />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            Italic
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle 
                            size="sm" 
                            pressed={editor.isActive("strike")} 
                            onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                            className={cn(editor.isActive("strike") && "bg-green-200/20 text-green-400")}>
                                <Strikethrough />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            Strike
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle 
                            size="sm" 
                            pressed={editor.isActive("heading", { level: 1 })} 
                            onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                            className={cn(editor.isActive("heading", { level: 1 }) && "bg-green-200/20 text-green-400")}>
                                <Heading1 />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            Heading 1
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle 
                            size="sm" 
                            pressed={editor.isActive("heading", { level: 2 })} 
                            onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            className={cn(editor.isActive("heading", { level: 2 }) && "bg-green-200/20 text-green-400")}>
                                <Heading2 />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            Heading 2
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle 
                            size="sm" 
                            pressed={editor.isActive("heading", { level: 3 })} 
                            onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                            className={cn(editor.isActive("heading", { level: 3 }) && "bg-green-200/20 text-green-400")}>
                                <Heading3 />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            Heading 3
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle 
                            size="sm" 
                            pressed={editor.isActive("bulletList")} 
                            onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                            className={cn(editor.isActive("bulletList") && "bg-green-200/20 text-green-400")}>
                                <ListIcon />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            Bullet List
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle 
                            size="sm" 
                            pressed={editor.isActive("orderedList")} 
                            onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                            className={cn(editor.isActive("orderedList") && "bg-green-200/20 text-green-400")}>
                                <ListOrderedIcon />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            Ordered List
                        </TooltipContent>
                    </Tooltip>
                </div>

                <div className="flex flex-wrap mx-2">
                    <div className="w-px bg-border h-8 mx-2"></div>
                    <div className="flex flex-wrap gap-1">
                        <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle 
                            size="sm" 
                            pressed={editor.isActive({textAlign: 'left'})} 
                            onPressedChange={() => editor.chain().focus().setTextAlign('left').run()}
                            className={cn(editor.isActive({textAlign: 'left'}) && "bg-green-200/20 text-green-400")}>
                                <AlignLeft />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            Align Left
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle 
                            size="sm" 
                            pressed={editor.isActive({textAlign: 'center'})} 
                            onPressedChange={() => editor.chain().focus().setTextAlign('center').run()}
                            className={cn(editor.isActive({textAlign: 'center'}) && "bg-green-200/20 text-green-400")}>
                                <AlignCenter />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            Align Center
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Toggle 
                            size="sm" 
                            pressed={editor.isActive({textAlign: 'right'})} 
                            onPressedChange={() => editor.chain().focus().setTextAlign('right').run()}
                            className={cn(editor.isActive({textAlign: 'right'}) && "bg-green-200/20 text-green-400")}>
                                <AlignRight />
                            </Toggle>
                        </TooltipTrigger>
                        <TooltipContent>
                            Align Right
                        </TooltipContent>
                    </Tooltip>
                    </div>
                    <div className="w-px h-8 bg-border mx-2"></div>
                    <div className="flex flex-wrap gap-1">
                        <Tooltip>
                        <TooltipTrigger asChild>
                            <Button 
                                size="sm" 
                                variant="ghost" 
                                type="button" 
                                onClick={() => editor.chain().focus().undo().run()}
                                disabled={!editor.can().undo()}
                                >
                                <Undo />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            Undo
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button 
                                size="sm" 
                                variant="ghost" 
                                type="button" 
                                onClick={() => editor.chain().focus().redo().run()}
                                disabled={!editor.can().redo()}
                                >
                                <Redo />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            Redo
                        </TooltipContent>
                    </Tooltip>
                    </div>
                </div>
            </TooltipProvider>
        </div>
    )
}