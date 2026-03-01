import { FileText, Calendar, LayoutDashboard, Settings, Plus, Search } from "lucide-react";

export default function Sidebar() {
    return (
        <aside className="sidebar w-64 h-screen flex flex-col justify-between p-4 flex-shrink-0">
            <div>
                {/* Логотип */}
                <div className="flex items-center gap-2 px-2 py-4 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold border border-primary/30 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                        SE
                    </div>
                    <span className="font-semibold text-lg tracking-wide text-foreground/90">Super Effective</span>
                </div>

                {/* Поиск */}
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                    <input
                        type="text"
                        placeholder="Поиск..."
                        className="w-full bg-white/5 border border-white/5 rounded-lg py-2 pl-9 pr-3 text-sm text-foreground/80 outline-none focus:border-primary/50 focus:bg-white/10 transition-all placeholder:text-foreground/30"
                    />
                </div>

                {/* Навигация */}
                <nav className="space-y-1">
                    <NavItem icon={<LayoutDashboard size={18} />} label="Дашборд" />
                    <NavItem icon={<FileText size={18} />} label="Заметки" active />
                    <NavItem icon={<Calendar size={18} />} label="Задачи" />
                </nav>
            </div>

            <div className="space-y-4">
                {/* Кнопка создания */}
                <button className="w-full flex items-center justify-center gap-2 bg-primary/90 hover:bg-primary text-white py-2.5 rounded-lg font-medium transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:-translate-y-0.5">
                    <Plus size={18} />
                    <span>Новая Заметка</span>
                </button>

                {/* Нижнее меню */}
                <nav className="space-y-1 pt-4 border-t border-white/5">
                    <NavItem icon={<Settings size={18} />} label="Настройки" />
                </nav>
            </div>
        </aside>
    );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
    return (
        <a
            href="#"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${active
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/60 hover:text-foreground/90 hover:bg-white/5"
                }`}
        >
            {icon}
            {label}
        </a>
    );
}
