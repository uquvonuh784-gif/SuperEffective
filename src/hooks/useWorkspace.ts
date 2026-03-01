import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Session } from '@supabase/supabase-js';

export interface Workspace {
    id: string;
    name: string;
    owner_id: string;
}

export interface NodeItem {
    id: string;
    workspace_id: string;
    title: string;
    is_task: boolean;
    status: string;
    priority: string;
    reward_points: number;
    content: { html: string } | null;
    created_at: string;
    updated_at: string;
    due_date: string | null;
    tags?: string[];
}

export function useWorkspace(session: Session | null) {
    const [workspace, setWorkspace] = useState<Workspace | null>(null);
    const [activeNode, setActiveNode] = useState<NodeItem | null>(null);
    const [notes, setNotes] = useState<NodeItem[]>([]);
    const [loadingWorkspace, setLoadingWorkspace] = useState(false);

    useEffect(() => {
        if (!session?.user) return;

        const initWorkspace = async () => {
            setLoadingWorkspace(true);
            try {
                // 1. Ищем существующий Воркспейс пользователя
                const { data: workspaces, error: fetchError } = await supabase
                    .from('workspaces')
                    .select('*')
                    .eq('owner_id', session.user.id)
                    .limit(1);

                if (fetchError) throw fetchError;

                let currentWorkspace = workspaces && workspaces.length > 0 ? workspaces[0] : null;

                if (!currentWorkspace) {
                    // 2. Если его нет — создаем новенький "Personal Workspace"
                    const { data: newWp, error: insertError } = await supabase
                        .from('workspaces')
                        .insert([{ name: 'Personal Workspace', owner_id: session.user.id }])
                        .select()
                        .single();

                    if (insertError) throw insertError;
                    currentWorkspace = newWp;

                    // 3. Создаем связь "Пользователь = Владелец Воркспейса"
                    const { error: memberError } = await supabase
                        .from('workspace_members')
                        .insert([
                            { workspace_id: newWp.id, user_id: session.user.id, role: 'owner' }
                        ]);

                    if (memberError) console.error("Member Link Error:", memberError);

                    // 4. Инициализируем систему геймификации для пользователя
                    const { error: gameError } = await supabase
                        .from('user_gamification')
                        .upsert([
                            { user_id: session.user.id, total_rp: 0, current_streak: 0 }
                        ]);

                    if (gameError) console.error("Gamification Error:", gameError);
                }

                setWorkspace(currentWorkspace);

                // 5. Ищем или создаем первичную Заметку для пользователя
                const { data: nodes, error: nodesError } = await supabase
                    .from('nodes')
                    .select('*')
                    .eq('workspace_id', currentWorkspace.id)
                    .order('updated_at', { ascending: false });

                if (nodesError) throw nodesError;

                if (nodes && nodes.length > 0) {
                    setNotes(nodes);
                    setActiveNode(nodes[0]);
                } else {
                    // Создаем дефолтную заметку
                    const { data: newNode, error: nodeInsertError } = await supabase
                        .from('nodes')
                        .insert([{
                            workspace_id: currentWorkspace.id,
                            title: 'Разработка нового интерфейса',
                            is_task: true,
                            status: 'in_progress',
                            priority: 'high',
                            reward_points: 150,
                            content: { html: `<h2>Прекрасный новый редактор! ✨</h2><p>Это твое гибридное рабочее пространство. Начни писать свой гениальный план здесь...</p>` }
                        }])
                        .select()
                        .single();

                    if (nodeInsertError) throw nodeInsertError;
                    setNotes([newNode]);
                    setActiveNode(newNode);
                }

            } catch (err) {
                console.error('Ошибка инициализации рабочего пространства:', err);
            } finally {
                setLoadingWorkspace(false);
            }
        };

        initWorkspace();
    }, [session]);

    return { workspace, activeNode, setActiveNode, notes, setNotes, loadingWorkspace };
}
