"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Menubar } from "./Menubar";
import TextAlign from "@tiptap/extension-text-align";

interface RichTextEditorProps {
    field: {
        onChange: (value: string) => void;
        value?: string;
    };
}

export function RichTextEditor({ field }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [StarterKit,
        TextAlign.configure({
            types: ['paragraph', 'heading', 'listItem'],
        })
        ],
        editorProps: {
            attributes: {
                class: 'min-h-[300px] px-4 py-6 rounded-b-lg focus:outline-none prose prose-sm sm:prose lg:prose-lg xl dark:prose-invert !w-full !max-w-none'
            }
        },
        onUpdate: ({ editor }) => {
            field.onChange(JSON.stringify(editor.getJSON()));
        },

        content: field.value ? JSON.parse(field.value) : '<p>Edit me</p>',
        immediatelyRender: false,
    });
    return (
        <div className="w-full border border-input rounded-lg overflow-hidden
        dark:bg-input/30">
            <Menubar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    )
}

