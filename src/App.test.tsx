import { render, screen } from '@testing-library/react'
import App from './App'

test('renders a label containing "Saturation"', () => {
  render(<App />)
  const linkElement = screen.getAllByText(/Saturation/i)
  expect(linkElement[0]).toBeInTheDocument()
})
