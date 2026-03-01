import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Super Effective - Task Tracker & AI',
  description: 'Гибридное рабочее пространство с поддержкой управления задачами и AI-ассистентом.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased min-h-screen bg-background text-foreground selection:bg-primary/30">
        {children}
      </body>
    </html>
  );
}
