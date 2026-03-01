"use client";

import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import Sidebar from "@/components/Sidebar";
import Editor from "@/components/Editor";
import Auth from "@/components/Auth";
import { useWorkspace } from "@/hooks/useWorkspace";

export default function Home() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Подключаем наш умный хук Воркспейса
  const { activeNode, loadingWorkspace } = useWorkspace(session);

  // Проверка сессии при загрузке
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Если проверяем сессию ИЛИ создаем Воркспейс - показываем прелоадер
  if (loading || (session && loadingWorkspace)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background flex-col gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
        <p className="text-foreground/50 text-sm animate-pulse">
          {loadingWorkspace ? "Инициализация рабочего пространства..." : "Проверка сессии..."}
        </p>
      </div>
    );
  }

  // Если нет сессии - показываем экран входа Auth.tsx
  if (!session) {
    return <Auth />;
  }

  // Если сессия есть - показываем основное приложение (Редактор)
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Боковая панель (Левая часть) */}
      <Sidebar />

      {/* Основной контент (Правая часть) */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Декоративный зеленый градиент (Glow) на заднем фоне */}
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="p-8 max-w-[1600px] w-full mx-auto flex-1 flex flex-col h-screen">
          {/* Header редактора */}
          <header className="mb-6 flex items-end justify-between pb-4">
            <div>
              {activeNode?.is_task && (
                <p className="text-sm font-medium text-primary mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                  {activeNode.status === 'in_progress' ? 'In Progress' : activeNode.status}
                </p>
              )}
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                {activeNode?.title || "Без названия"}
              </h1>
            </div>
            {/* Кнопка выхода для тестов */}
            <button
              onClick={() => supabase.auth.signOut()}
              className="text-sm text-foreground/50 hover:text-red-400 font-medium transition-colors px-3 py-1.5 rounded-md hover:bg-red-500/10"
            >
              Выйти из аккаунта
            </button>
          </header>

          {/* Рабочая зона: сплит 70 (Редактор) / 30 (Атрибуты) */}
          <div className="flex flex-1 gap-6 min-h-0">

            {/* Левая часть: Редактор (70%) */}
            <div className="glass-panel p-8 shadow-2xl flex-col flex flex-[7] border-t border-l border-white/10 relative overflow-hidden">
              {activeNode ? (
                <Editor
                  nodeId={activeNode.id}
                  initialContent={activeNode.content?.html}
                />
              ) : (
                <div className="flex items-center justify-center p-8 text-foreground/50">Загрузка редактора...</div>
              )}
            </div>

            {/* Правая часть: Панель атрибутов (30%) */}
            <div className="flex-[3] flex flex-col gap-6 overflow-y-auto pr-2 pb-8">

              {/* Блок метаданных */}
              <div className="glass-panel p-6 border-t border-l border-white/10 flex flex-col gap-4">
                <h3 className="text-lg font-semibold text-foreground/90 border-b border-white/10 pb-2 mb-2">Детали задачи</h3>

                <div className="flex flex-col gap-1">
                  <span className="text-xs text-foreground/40 font-medium uppercase tracking-wider">Создано</span>
                  <span className="text-sm text-foreground/80">
                    {activeNode?.created_at ? new Date(activeNode.created_at).toLocaleString() : 'Неизвестно'}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs text-foreground/40 font-medium uppercase tracking-wider">Дедлайн</span>
                  <span className="text-sm text-foreground/80 flex items-center gap-2">
                    {activeNode?.due_date ? new Date(activeNode.due_date).toLocaleDateString() : 'Не установлен'}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs text-foreground/40 font-medium uppercase tracking-wider">Приоритет</span>
                  <span className="text-sm flex items-center gap-1.5 px-2 py-1 bg-red-500/10 text-red-400 w-fit rounded-md border border-red-500/20 capitalize">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span> {activeNode?.priority || 'Обычный'}
                  </span>
                </div>

                {activeNode?.is_task && (
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-foreground/40 font-medium uppercase tracking-wider">Награда</span>
                    <span className="text-sm font-semibold text-primary px-2 py-1 bg-primary/10 w-fit rounded-md border border-primary/20">
                      +{activeNode?.reward_points || 0} RP
                    </span>
                  </div>
                )}
              </div>

              {/* Блок действий */}
              <div className="glass-panel p-6 border-t border-l border-white/10 flex flex-col gap-3">
                <h3 className="text-lg font-semibold text-foreground/90 border-b border-white/10 pb-2 mb-2">Действия</h3>

                <button className="w-full text-left px-4 py-2.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-colors text-sm border border-primary/20 flex items-center justify-between">
                  В Google Календарь
                  <span>📅</span>
                </button>

                <button className="w-full text-left px-4 py-2.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-medium transition-colors text-sm border border-blue-500/20 flex items-center justify-between">
                  Синхронизация Google Drive
                  <span>☁️</span>
                </button>

                <button className="w-full text-left px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-foreground/80 font-medium transition-colors text-sm border border-white/5 flex items-center justify-between mt-2">
                  Архивировать
                  <span>📦</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
