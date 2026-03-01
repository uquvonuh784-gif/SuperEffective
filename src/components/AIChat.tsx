"use client";

import { useState, useRef, useEffect } from "react";
import { NodeItem } from "@/hooks/useWorkspace";
import { Send, Bot, User, Trash2, Cpu } from "lucide-react";

interface Message {
    role: 'user' | 'model';
    content: string;
}

interface AIChatProps {
    nodes: NodeItem[];
    activeNode?: NodeItem | null;
}

export default function AIChat({ nodes, activeNode }: AIChatProps) {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', content: 'Привет! Я твой AI-помощник Super Effective. Я уже проанализировал твои задачи и готов помочь с декомпозицией или планированием. Что будем делать?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg: Message = { role: 'user', content: input.trim() };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: newMessages,
                    contextData: nodes,
                    activeNode: activeNode
                })
            });

            const data = await response.json();

            if (response.ok) {
                setMessages(prev => [...prev, { role: 'model', content: data.text }]);
            } else {
                setMessages(prev => [...prev, { role: 'model', content: `❌ Ошибка: ${data.error}` }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'model', content: `❌ Ошибка запроса: ${error}` }]);
        } finally {
            setLoading(false);
        }
    };

    const handleClear = () => {
        setMessages([
            { role: 'model', content: 'Привет! Я твой AI-помощник Super Effective. Чем могу помочь сегодня?' }
        ]);
    };

    return (
        <div className="flex flex-col h-full w-full glass-panel border border-white/5 shadow-2xl overflow-hidden rounded-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/5 flex-shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                        <Cpu size={18} />
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground/90 text-sm">AI Копилот (Llama 3)</h3>
                        <p className="text-[10px] text-foreground/50 uppercase tracking-widest mt-0.5">В сети</p>
                    </div>
                </div>
                <button
                    onClick={handleClear}
                    className="text-foreground/40 hover:text-red-400 transition-colors p-2 hover:bg-red-400/10 rounded-md"
                    title="Очистить чат"
                >
                    <Trash2 size={16} />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar" ref={scrollRef}>
                {messages.map((m, i) => (
                    <div key={i} className={`flex gap-3 max-w-[90%] ${m.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full mt-1 ${m.role === 'user' ? 'bg-white/10 text-foreground' : 'bg-primary/20 text-primary border border-primary/20'
                            }`}>
                            {m.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                        </div>

                        <div className={`p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${m.role === 'user' ? 'bg-white/10 text-foreground/90 rounded-tr-sm' : 'bg-primary/5 text-foreground/80 border border-primary/10 rounded-tl-sm'
                            }`}>
                            {m.content}
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex gap-3 max-w-[90%]">
                        <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full mt-1 bg-primary/20 text-primary border border-primary/20">
                            <Bot size={14} />
                        </div>
                        <div className="p-3 rounded-2xl text-sm leading-relaxed bg-primary/5 text-foreground/80 border border-primary/10 rounded-tl-sm flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                            <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                            <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/5 bg-black/20 flex-shrink-0">
                <div className="relative flex items-center">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        placeholder="Спроси AI о задачах..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-foreground/90 outline-none focus:border-primary/50 focus:bg-white/10 transition-all placeholder:text-foreground/30 resize-none min-h-[44px] max-h-[120px] custom-scrollbar"
                        rows={1}
                        style={{ fieldSizing: "content" }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || loading}
                        className="absolute right-2 bottom-2 p-2 bg-primary text-black rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <Send size={16} />
                    </button>
                </div>
                <p className="text-center text-[10px] text-foreground/40 mt-2">
                    AI анализирует только твои текущие задачи и текст.
                </p>
            </div>
        </div>
    );
}
