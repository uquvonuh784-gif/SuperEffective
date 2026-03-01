"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Italic, Strikethrough, Heading1, Heading2, List, ListOrdered, Quote, Code } from "lucide-react";

export default function Editor() {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
        ],
        content: `
      <h2>Прекрасный новый редактор! ✨</h2>
      <p>Это твое гибридное рабочее пространство. Начни писать свой гениальный план здесь...</p>
      <ul>
        <li>Поддерживаются списки</li>
        <li><strong>Жирный текст</strong> и <em>Курсив</em></li>
        <li>И даже <code>встроенный код</code></li>
      </ul>
    `,
        editorProps: {
            attributes: {
                class:
                    "prose prose-invert max-w-none w-full outline-none min-h-[500px] " +
                    "px-4 py-6 border-transparent focus:ring-0 " +
                    "[&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-6 [&_h1]:text-foreground " +
                    "[&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:text-foreground/90 " +
                    "[&_p]:text-foreground/80 [&_p]:leading-relaxed [&_p]:mb-4 " +
                    "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:text-foreground/80 " +
                    "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:text-foreground/80 " +
                    "[&_li]:mb-1 " +
                    "[&_blockquote]:border-l-4 [&_blockquote]:border-primary/50 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-foreground/60 " +
                    "[&_code]:bg-black/30 [&_code]:text-primary [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded text-lg",
            },
        },
    });

    if (!editor) {
        return null;
    }

    return (
        <div className="flex flex-col h-full">
            {/* Тулбар (Панель инструментов) */}
            <div className="flex items-center gap-1 p-2 mb-4 rounded-xl glass-panel bg-white/5 border border-white/10 sticky top-0 z-10 w-fit">
                <ToolbarButton
                    active={editor.isActive('bold')}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    icon={<Bold size={18} />}
                    title="Жирный"
                />
                <ToolbarButton
                    active={editor.isActive('italic')}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    icon={<Italic size={18} />}
                    title="Курсив"
                />
                <ToolbarButton
                    active={editor.isActive('strike')}
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    icon={<Strikethrough size={18} />}
                    title="Зачеркнутый"
                />

                <div className="w-px h-6 bg-white/10 mx-1"></div>

                <ToolbarButton
                    active={editor.isActive('heading', { level: 1 })}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    icon={<Heading1 size={18} />}
                    title="Заголовок 1"
                />
                <ToolbarButton
                    active={editor.isActive('heading', { level: 2 })}
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    icon={<Heading2 size={18} />}
                    title="Заголовок 2"
                />

                <div className="w-px h-6 bg-white/10 mx-1"></div>

                <ToolbarButton
                    active={editor.isActive('bulletList')}
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    icon={<List size={18} />}
                    title="Маркированный список"
                />
                <ToolbarButton
                    active={editor.isActive('orderedList')}
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    icon={<ListOrdered size={18} />}
                    title="Нумерованный список"
                />
                <ToolbarButton
                    active={editor.isActive('blockquote')}
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    icon={<Quote size={18} />}
                    title="Цитата"
                />
                <ToolbarButton
                    active={editor.isActive('code')}
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    icon={<Code size={18} />}
                    title="Код"
                />
            </div>

            {/* Сама зона редактора */}
            <div className="flex-1 overflow-y-auto pr-4 scroll-smooth">
                <EditorContent editor={editor} className="h-full" />
            </div>
        </div>
    );
}

function ToolbarButton({
    icon,
    onClick,
    active,
    title
}: {
    icon: React.ReactNode;
    onClick: () => void;
    active: boolean;
    title: string
}) {
    return (
        <button
            onClick={onClick}
            title={title}
            className={`p-2 rounded-lg transition-all ${active
                ? "bg-primary/20 text-primary border border-primary/30"
                : "text-foreground/60 hover:bg-white/10 hover:text-foreground/90 border border-transparent"
                }`}
        >
            {icon}
        </button>
    );
}
