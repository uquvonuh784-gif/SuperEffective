import Groq from "groq-sdk";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { messages, contextData, activeNode } = await req.json();

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "Ключ GROQ_API_KEY не задан в переменных окружения." }, { status: 500 });
        }

        const groq = new Groq({ apiKey });

        // Кратко переводим контекст задач пользователя
        const tasksSummary = contextData
            ?.filter((n: { is_task?: boolean }) => n.is_task)
            .map((t: { title?: string, status?: string, due_date?: string, priority?: string }) => `Задача: ${t.title || 'Без названия'} | Статус: ${t.status} | Дедлайн: ${t.due_date ? new Date(t.due_date).toLocaleDateString() : 'Нет'} | Приоритет: ${t.priority}`)
            .join("\n");

        let activeNodeContext = "";
        if (activeNode) {
            // Если открыта конкретная заметка (или задача)
            const typeNode = activeNode.is_task ? "задачу" : "заметку";
            const contentCleanText = activeNode.content?.html?.replace(/<[^>]*>?/gm, '') || "Пусто";
            activeNodeContext = `\nОЧЕНЬ ВАЖНО: Сейчас пользователь смотрит на ${typeNode} "${activeNode.title || 'Без названия'}".
Она содержит следующий текст (HTML/Markdown был очищен): "${contentCleanText}".
Если пользователь задает вопрос (например "что тут?", "напиши план" или "декомпозируй"), он имеет в виду ИМЕННО эту открытую ${typeNode}.\n`;
        }

        const systemInstruction = `Ты дружелюбный и суперопытный AI-ассистент в приложении Super Effective (сочетание Канбана и Заметок с элементами геймификации).
Твоя задача — помогать пользователю декомпозировать задачи, управлять временем и давать советы. Коротко отвечай по-русски. Размечай текст Markdown-ом.${activeNodeContext}
Текущие глобальные задачи пользователя (в Канбане):
${tasksSummary || "Нет текущих задач."}`;

        // Gemini uses 'model', but Groq (OpenAI format) uses 'assistant'
        // We map the role back and forth
        const formattedMessages = messages.map((m: { role: string, content: string }) => ({
            role: m.role === 'model' ? 'assistant' : m.role,
            content: m.content
        }))
        // filter out the initial welcome message since it might cause issues or just let it be as context?
        // Let's filter out the initial welcome model message if it's the very first one, just in case
        const conversationHistory = formattedMessages[0]?.role === 'assistant'
            ? formattedMessages.slice(1)
            : formattedMessages;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: systemInstruction },
                ...conversationHistory
            ],
            model: "llama-3.3-70b-versatile", // Use a fast and smart model that is free on Groq
        });

        const responseText = chatCompletion.choices[0]?.message?.content || "";

        return NextResponse.json({ text: responseText });

    } catch (error: unknown) {
        console.error("AI API Error:", error);
        return NextResponse.json({ error: (error as Error).message || "Ошибка сервера" }, { status: 500 });
    }
}
