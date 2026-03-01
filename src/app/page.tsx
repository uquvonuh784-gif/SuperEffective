export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-background via-background to-[#1e1a2b]">
      <div className="glass-panel p-12 max-w-2xl text-center space-y-6">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400">
          Super Effective
        </h1>

        <p className="text-lg text-foreground/80 leading-relaxed">
          Гибридное рабочее пространство, объединяющее функциональность создания заметок и управления задачами.
        </p>

        <div className="pt-4 flex justify-center gap-4">
          <button className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-white font-medium transition-all shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5">
            Начать работу
          </button>
          <button className="px-6 py-2.5 rounded-lg glass-panel hover:bg-white/5 transition-colors font-medium">
            Документация
          </button>
        </div>
      </div>
    </main>
  );
}
