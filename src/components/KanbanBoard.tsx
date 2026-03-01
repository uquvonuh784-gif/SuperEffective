"use client";

import { useState } from "react";

import { NodeItem } from "@/hooks/useWorkspace";
import { supabase } from "@/lib/supabase/client";

interface KanbanBoardProps {
    workspaceId?: string;
    nodes: NodeItem[];
    onNotesChange: (notes: NodeItem[]) => void;
    onSelectTask: (node: NodeItem) => void;
}

const COLUMNS = [
    { id: 'todo', title: 'To Do', color: 'bg-foreground/5' },
    { id: 'in_progress', title: 'In Progress', color: 'bg-primary/10 border-primary/20' },
    { id: 'done', title: 'Done', color: 'bg-green-500/10 border-green-500/20' },
    { id: 'paused', title: 'Пауза', color: 'bg-yellow-500/10 border-yellow-500/20', collapsible: true },
    { id: 'archived', title: 'Архив', color: 'bg-white/5 border-white/10', collapsible: true }
];

export default function KanbanBoard({ workspaceId, nodes, onNotesChange, onSelectTask }: KanbanBoardProps) {
    const tasks = nodes.filter(n => n.is_task);

    // По-умолчанию скрываем Паузу и Архив
    const [collapsedCols, setCollapsedCols] = useState<Record<string, boolean>>({
        paused: true,
        archived: true
    });

    const toggleColumn = (colId: string) => {
        setCollapsedCols(prev => ({ ...prev, [colId]: !prev[colId] }));
    };

    const handleCreateTask = async (status: string) => {
        if (!workspaceId) return;

        const { data: newNode, error } = await supabase
            .from('nodes')
            .insert([{
                workspace_id: workspaceId,
                title: 'Новая задача',
                is_task: true,
                status: status,
                priority: 'medium',
                reward_points: 10,
                content: { html: `<h2>Описание задачи</h2><p></p>` }
            }])
            .select()
            .single();

        if (error) {
            console.error("Ошибка при создании задачи:", error);
            return;
        }

        if (newNode) {
            onNotesChange([newNode, ...nodes]);
        }
    };

    const handleUpdateStatus = async (task: NodeItem, newStatus: string) => {
        const { error } = await supabase
            .from('nodes')
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq('id', task.id);

        if (error) {
            console.error("Ошибка при обновлении статуса:", error);
            return;
        }

        onNotesChange(nodes.map(n => n.id === task.id ? { ...n, status: newStatus } : n));
    };

    const handleDrop = (e: React.DragEvent, status: string) => {
        e.preventDefault();
        const taskId = e.dataTransfer.getData('taskId');
        if (!taskId) return;

        const task = tasks.find(t => t.id === taskId);
        if (task && task.status !== status) {
            handleUpdateStatus(task, status);
        }
    };

    return (
        <div className="flex h-full w-full overflow-x-auto pb-4 gap-0">
            {COLUMNS.map((col, index) => {
                const colTasks = tasks.filter(t => t.status === col.id);
                const isCollapsed = col.collapsible && collapsedCols[col.id];

                return (
                    <div
                        key={col.id}
                        className={`flex flex-col gap-4 px-6 transition-all duration-300 ${isCollapsed ? 'min-w-[60px] max-w-[60px] items-center cursor-pointer hover:bg-white/5 rounded-lg' : 'flex-1 min-w-[300px]'
                            } ${index < COLUMNS.length - 1 ? 'border-r border-white/5' : ''}`}
                        onDragOver={(e) => !isCollapsed && e.preventDefault()}
                        onDrop={(e) => !isCollapsed && handleDrop(e, col.id)}
                        onClick={() => isCollapsed && toggleColumn(col.id)}
                    >
                        {isCollapsed ? (
                            <div className="flex flex-col items-center gap-4 py-4 opacity-50 hover:opacity-100">
                                <span className="rotate-90 whitespace-nowrap font-medium tracking-widest mt-10">
                                    {col.title} ({colTasks.length})
                                </span>
                            </div>
                        ) : (
                            <>
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-foreground/80 flex items-center gap-2">
                                        {col.title}
                                        <span className="bg-white/10 px-2 py-0.5 rounded-full text-xs text-foreground/60">
                                            {colTasks.length}
                                        </span>
                                    </h3>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => handleCreateTask(col.id)}
                                            className="text-foreground/40 hover:text-primary transition-colors hover:bg-white/5 p-1 rounded"
                                            title="Добавить задачу"
                                        >
                                            +
                                        </button>
                                        {col.collapsible && (
                                            <button
                                                onClick={() => toggleColumn(col.id)}
                                                className="text-foreground/40 hover:text-foreground transition-colors hover:bg-white/5 p-1 rounded ml-2"
                                                title="Свернуть колонку"
                                            >
                                                ▶
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col gap-3">
                                    {colTasks.map(task => (
                                        <div
                                            key={task.id}
                                            draggable
                                            onDragStart={(e) => e.dataTransfer.setData('taskId', task.id)}
                                            className={`glass-panel p-4 cursor-grab active:cursor-grabbing hover:border-primary/50 transition-all border border-white/5 shadow-lg group ${col.id === 'in_progress' ? 'bg-primary/5' : ''
                                                }`}
                                            onClick={() => onSelectTask(task)}
                                        >
                                            <h4 className="font-medium text-foreground mb-2 group-hover:text-primary transition-colors">
                                                {task.title || "Без названия"}
                                            </h4>

                                            <div className="flex items-center justify-between mt-4">
                                                <span className="text-xs font-semibold text-primary px-2 py-1 bg-primary/10 rounded-md">
                                                    +{task.reward_points || 0} RP
                                                </span>

                                                <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                                                    <select
                                                        className="bg-black/40 text-xs border border-white/10 rounded px-1.5 py-1 text-foreground/70 outline-none"
                                                        value={task.status}
                                                        onChange={(e) => handleUpdateStatus(task, e.target.value)}
                                                    >
                                                        <option value="todo">To Do</option>
                                                        <option value="in_progress">In Progress</option>
                                                        <option value="done">Done</option>
                                                        <option value="paused">Пауза</option>
                                                        <option value="archived">Архив</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
