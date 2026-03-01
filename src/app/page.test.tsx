import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Home from './page'

describe('Dashboard/Editor Page (Home)', () => {
    it('renders the Sidebar with navigation buttons', () => {
        render(<Home />)
        expect(screen.getByText('Super Effective')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /Новая Заметка/i })).toBeInTheDocument()
        expect(screen.getByText('Дашборд')).toBeInTheDocument()
        expect(screen.getByText('Задачи')).toBeInTheDocument()
    })

    it('renders the main Editor Header', () => {
        render(<Home />)
        expect(screen.getByText('Разработка нового интерфейса')).toBeInTheDocument()
        expect(screen.getByText('In Progress')).toBeInTheDocument()
    })

    it('renders the metadata block and action buttons', () => {
        render(<Home />)
        expect(screen.getByText('+150 RP')).toBeInTheDocument()
        expect(screen.getByText('Детали задачи')).toBeInTheDocument()
        expect(screen.getByText(/В Google Календарь/i)).toBeInTheDocument()
    })
})
