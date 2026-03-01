# Super Effective - Task Tracker & AI

Гибридное рабочее пространство (Заметки + Задачи) с системой геймификации и проактивным AI. Заменяет собой связку Notion + Todoist + Google Calendar/Drive.

## Текущий Статус (Этапы 1, 2 и часть 3)
На данный момент реализовано:
1. **Фундамент проекта**: Настроен Next.js (App Router, Tailwind CSS, TypeScript).
2. **База данных (Supabase)**: Спроектирована и описана в `database/schema.sql`.
3. **UI/UX (Vanilla CSS Glassmorphism)**: Подготовлена стартовая страница и базовые CSS-переменные для дизайна "темного стекла" (`app/globals.css`).
4. **Тестирование**: Настроен фреймворк `vitest` + `testing-library`, написаны тесты (адаптированы с учетом асинхронности).
5. **Агенты и Навыки**: Разработаны AI-навыки (Skills) для Git, UI/UX, Архитектуры.
6. **Авторизация**: Интегрирован Supabase Auth (Email/Пароль), логика условного рендера (Auth.tsx) при отсутствии сессии.
7. **Инициализация Воркспейса**: Написан умный хук `useWorkspace`, который автоматически создает `Personal Workspace`, профиль геймификации и первую стартовую "Заметку", если пользователь заходит впервые.
8. **Редактор и Дебаунс**: Внедрен Tiptap Editor с debounced автосохранением в базу данных Supabase (в таблицу `nodes`). Метаданные (RP, Дедлайн, Дата) теперь берутся напрямую из БД.

## Документация продукта
- [Product Requirements Document (PRD)](task_tracker_prd.md)
- [Архитектурный План](architecture_plan.md)
- [Бизнес-Логика](business_logic.md)

## Стэк Технологий
- **Фронтенд:** Next.js, React, Tailwind CSS (для layout), Vanilla CSS (для UI эффектов/Glassmorphism).
- **Редактор:** Tiptap & lucide-react (установлены, готовы к интеграции).
- **Бэкенд:** Supabase (PostgreSQL, Auth, Realtime).
- **Тестирование:** Vitest + Testing Library.

## Запуск
1. Убедитесь, что выполнен SQL-скрипт `database/schema.sql` в вашем проекте Supabase.
2. Пропишите ключи в `.env.local` (см. `.env.local.example`).
3. Для старта используйте `start.bat` (кликом на Windows) или `npm run dev` в терминале.
