# Архитектурный План (Architecture Plan)

Этот документ описывает техническое устройство гибридного рабочего пространства "Super Effective" на базе обновленных требований (PRD) и бизнес-логики.

## 1. Структура Базы Данных (Supabase / PostgreSQL)

Мы используем паттерн "Унифицированная Нода" (Unified Node). Заметка и Задача — это одна и та же сущность в таблице `nodes`.

### Таблица `users` (из Supabase Auth)
- `id` (uuid, PK)
- `email` (text)
- `created_at` (timestamp)

### Таблица `workspaces`
- `id` (uuid, PK)
- `name` (text)
- `owner_id` (uuid, FK to users.id)
- `created_at` (timestamp)

### Таблица `workspace_members` (RBAC)
- `workspace_id` (uuid, FK)
- `user_id` (uuid, FK)
- `role` (enum: 'owner', 'editor', 'viewer')
- PRIMARY KEY (`workspace_id`, `user_id`)

### Таблица `nodes` (Основная сущность: Заметки и Задачи)
- `id` (uuid, PK)
- `workspace_id` (uuid, FK)
- `title` (text) - Заголовок заметки/задачи
- `content` (jsonb / text) - Содержимое документа (Markdown или JSON от Tiptap/BlockNote)
- `is_task` (boolean, default: false) - Флаг, превращающий заметку в задачу
- **Метаданные задачи (nullable, если `is_task = false`):**
  - `status` (enum: 'todo', 'in_progress', 'done', 'archived')
  - `priority` (enum: 'low', 'medium', 'high')
  - `due_date` (timestamp) - По умолчанию устанавливается на сегодня при создании задачи
  - `assignee_id` (uuid, FK to users.id)
  - `reward_points` (integer, default: 10) - Баллы (RP)
  - `google_drive_file_id` (text, nullable) - ID файла на Google Drive, если прикрепили
- **Системные поля:**
  - `created_at` (timestamp, default: now())
  - `updated_at` (timestamp, default: now())

### Таблица `node_links` (Для Графа связей)
- `source_id` (uuid, FK to nodes.id)
- `target_id` (uuid, FK to nodes.id)
- PRIMARY KEY (`source_id`, `target_id`)

### Таблица `user_gamification` (Для отслеживания баллов)
- `user_id` (uuid, FK to users.id, PK)
- `total_rp` (integer, default: 0)
- `current_streak` (integer, default: 0) - Подряд дней с выполненными задачами
- `last_task_done_date` (date) - Для сброса метрики streak

## 2. Архитектура Next.js (App Router)

### 2.1 Роутинг
- `/(auth)/login` — Страница авторизации.
- `/app` — Редирект на последний открытый Workspace.
- `/app/[workspaceId]` — Дашборд рабочего пространства (Серверный компонент для SEO и скорости начальной загрузки, если возможно).
- `/app/[workspaceId]/n/[nodeId]` — Страница редактора конкретной Заметки/Задачи (Клиентский компонент Tiptap/BlockNote).
- `/app/[workspaceId]/kanban` — Доска задач. Роут загружает только `nodes` со статусами `todo`, `in_progress`, и `done` (исключая `archived`).
- `/app/[workspaceId]/graph` — Визуализация графа связей.

### 2.2 Рендеринг (RSC vs CSR)
- **Server Components (RSC):** Проверка авторизации, загрузка структуры workspace для сайдбара и базового SEO.
- **Client Components (CSR):** 
  - Редактор документов (Tiptap требует CSR).
  - Интерактивные компоненты Канбан-доски (drag'n'drop).
  - Компоненты UI (модальные окна, выпадающие списки).

## 3. Стейт-Менеджмент и Data Fetching
- **Realtime Collaboration:** Используем **Supabase Realtime**. Интерактивные сессии редактора и доска канбан слушают изменения в таблице `nodes` (через WebSocket), чтобы UI мгновенно синхронизировался у всех участников workspace.
- **Client Cache (SWR / React Query):** Для Optimistic Updates статусов задач (чтобы UI реагировал мгновенно без дожидания ответа от Supabase).

## 4. Фоновые процессы (Cron Jobs и AI)
Поскольку нам нужны регулярные проверки (проактивные напоминания):
- **Cron Jobs:** Можно использовать платформу типа Inngest, Trigger.dev или Vercel Cron Jobs для вызова API-роутов по расписанию (например, каждый час).
- Роут `POST /api/cron/ai-reminders` собирает `nodes` в статусах `todo` и `in_progress`, где `updated_at` < (сейчас - X дней), и передает их в Google Gemini API для генерации сводки и отправки уведомлений.

## 5. UI и Стилизация (Glassmorphism + Vanilla CSS)
- Базовая сетка и позиционирование могут быть построены на встроенных средствах (Tailwind).
- Основной фокус на **Vanilla CSS** для создания премиального вида:
  - Сложные градиенты (linear-gradient, radial-gradient).
  - Glassmorphism (свойства `backdrop-filter: blur()`, `background: rgba()`).
  - Микро-интеракции (hover, focus states) с использованием CSS `transition`.
