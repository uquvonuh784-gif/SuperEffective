-- Создание типов (Enums)
CREATE TYPE workspace_role AS ENUM ('owner', 'editor', 'viewer');
CREATE TYPE node_status AS ENUM ('todo', 'in_progress', 'done', 'archived');
CREATE TYPE node_priority AS ENUM ('low', 'medium', 'high');

-- Таблица Workspaces
CREATE TABLE workspaces (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица RBAC (Workspace Members)
CREATE TABLE workspace_members (
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role workspace_role NOT NULL DEFAULT 'viewer',
    PRIMARY KEY (workspace_id, user_id)
);

-- Основная таблица Nodes (Заметки и Задачи)
CREATE TABLE nodes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content JSONB DEFAULT '{}'::jsonb,
    is_task BOOLEAN DEFAULT FALSE,
    
    -- Properties (Только для задач)
    status node_status,
    priority node_priority,
    due_date TIMESTAMP WITH TIME ZONE,
    assignee_id UUID REFERENCES auth.users(id),
    reward_points INTEGER DEFAULT 10,
    google_drive_file_id TEXT,
    
    -- Системные даты
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица графа (Связи между нодами)
CREATE TABLE node_links (
    source_id UUID REFERENCES nodes(id) ON DELETE CASCADE,
    target_id UUID REFERENCES nodes(id) ON DELETE CASCADE,
    PRIMARY KEY (source_id, target_id)
);

-- Таблица Геймификации
CREATE TABLE user_gamification (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    total_rp INTEGER DEFAULT 0,
    current_streak INTEGER DEFAULT 0,
    last_task_done_date DATE
);

-- Базовые RLS (Row Level Security)
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE node_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_gamification ENABLE ROW LEVEL SECURITY;

-- Простейшая политика (Пример для тестов): разрешить все действия авторизованным пользователям
-- В будущем RLS нужно будет настроить строго под workspace_members.
CREATE POLICY "Allow members full access to workspaces" ON workspaces
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow members full access to nodes" ON nodes
    FOR ALL USING (auth.role() = 'authenticated');
