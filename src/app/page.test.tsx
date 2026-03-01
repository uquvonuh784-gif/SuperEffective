import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Home from './page'

describe('Home Page', () => {
    it('renders the main heading', () => {
        render(<Home />)
        const heading = screen.getByRole('heading', { level: 1 })
        expect(heading).toBeInTheDocument()
        expect(heading).toHaveTextContent('Super Effective')
    })

    it('renders the main description', () => {
        render(<Home />)
        const text = screen.getByText(/Гибридное рабочее пространство/i)
        expect(text).toBeInTheDocument()
    })

    it('renders two main buttons', () => {
        render(<Home />)
        const startButton = screen.getByRole('button', { name: /Начать работу/i })
        const docsButton = screen.getByRole('button', { name: /Документация/i })
        expect(startButton).toBeInTheDocument()
        expect(docsButton).toBeInTheDocument()
    })
})
