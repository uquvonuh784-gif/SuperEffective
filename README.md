# Super Effective - Task Tracker & AI

Гибридное рабочее пространство (Заметки + Задачи) с системой геймификации и проактивным AI. Заменяет собой связку Notion + Todoist + Google Calendar/Drive.

## Текущий Статус (Этап 1 и 2)
На данный момент реализовано:
1. **Фундамент проекта**: Настроен Next.js (App Router, Tailwind CSS, TypeScript).
2. **База данных (Supabase)**: Спроектирована и описана в `database/schema.sql` (Unified Node Pattern, связи, Role-Based Access Control, система геймификации).
3. **UI/UX (Vanilla CSS Glassmorphism)**: Подготовлена стартовая страница и базовые CSS-переменные для премиального внешнего вида в стиле "темного стекла" (`app/globals.css`).
4. **Тестирование**: Настроен и подключен фреймворк `vitest` + `testing-library`, написаны первые работающие тесты для главной страницы (`npm run test`).
5. **Агенты и Навыки**: Разработаны AI-навыки (Skills) для Git (`.agents/skills/git`), UI/UX, разработки и планирования архитектуры.

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
