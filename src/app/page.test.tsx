import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Home from './page'

// Мокаем Supabase клиент
vi.mock('@/lib/supabase/client', () => ({
    supabase: {
        auth: {
            getSession: vi.fn().mockResolvedValue({ data: { session: { user: { id: '123' } } } }),
            onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
        }
    }
}));

// Мокаем хук useWorkspace
vi.mock('@/hooks/useWorkspace', () => ({
    useWorkspace: vi.fn().mockReturnValue({
        workspace: { id: '1' },
        activeNode: {
            id: 'node_1',
            title: 'Разработка нового интерфейса',
            is_task: true,
            status: 'in_progress',
            priority: 'high',
            reward_points: 150,
            content: { html: '<p>test</p>' }
        },
        notes: [],
        loadingWorkspace: false
    })
}));

// Ждем эффекты
const waitForLoading = async () => {
    await screen.findByText('Super Effective');
}
describe('Dashboard/Editor Page (Home)', () => {
    it('renders the Sidebar with navigation buttons', async () => {
        render(<Home />)
        await waitForLoading()
        expect(screen.getByRole('button', { name: /Новая Заметка/i })).toBeInTheDocument()
        expect(screen.getByText('Дашборд')).toBeInTheDocument()
        expect(screen.getByText('Задачи')).toBeInTheDocument()
    })

    it('renders the main Editor Header', async () => {
        render(<Home />)
        await waitForLoading()
        expect(screen.getByText('Разработка нового интерфейса')).toBeInTheDocument()
        expect(screen.getByText('In Progress')).toBeInTheDocument()
    })

    it('renders the metadata block and action buttons', async () => {
        render(<Home />)
        await waitForLoading()
        expect(screen.getByText('+150 RP')).toBeInTheDocument()
        expect(screen.getByText('Детали задачи')).toBeInTheDocument()
        expect(screen.getByText(/В Google Календарь/i)).toBeInTheDocument()
    })
})
