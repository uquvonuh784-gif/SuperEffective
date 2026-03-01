import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { messages, contextData } = await req.json();

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ error: "Ключ GEMINI_API_KEY не задан в переменных окружения." }, { status: 500 });
        }

        const genAI = new GoogleGenerativeAI(apiKey);

        // Кратко переводим контекст задач пользователя
        const tasksSummary = contextData
            ?.filter((n: { is_task?: boolean }) => n.is_task)
            .map((t: { title?: string, status?: string, due_date?: string, priority?: string }) => `Задача: ${t.title || 'Без названия'} | Статус: ${t.status} | Дедлайн: ${t.due_date ? new Date(t.due_date).toLocaleDateString() : 'Нет'} | Приоритет: ${t.priority}`)
            .join("\n");

        const systemInstruction = `Ты дружелюбный и суперопытный AI-ассистент в приложении Super Effective (сочетание Канбана и Заметок с элементами геймификации).
Твоя задача — помогать пользователю декомпозировать задачи, управлять временем и давать советы.
Используй красивое форматирование Markdown. Пиши лаконично, но полезно.
Текущие задачи пользователя:
${tasksSummary || "Нет текущих задач."}`;

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: systemInstruction,
        });

        // Исключаем начальные сообщения от 'model', так как Gemini требует начинать с 'user'
        const rawHistory = messages.slice(0, -1);
        const firstUserIndex = rawHistory.findIndex((m: { role: string }) => m.role === 'user');
        const validHistory = firstUserIndex >= 0 ? rawHistory.slice(firstUserIndex) : [];

        // Создаем чат историю
        const chat = model.startChat({
            history: validHistory.map((m: { role: string, content: string }) => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.content }]
            }))
        });

        // Отправляем последнее сообщение
        const lastMessage = messages[messages.length - 1];
        const result = await chat.sendMessage(lastMessage.content);

        const responseText = result.response.text();

        return NextResponse.json({ text: responseText });

    } catch (error: unknown) {
        console.error("AI API Error:", error);
        return NextResponse.json({ error: (error as Error).message || "Ошибка сервера" }, { status: 500 });
    }
}
