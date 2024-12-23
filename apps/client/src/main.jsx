// React
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// React Router
import { BrowserRouter, Routes, Route } from 'react-router'

// Mantine
import '@mantine/core/styles.css'
import { MantineProvider } from '@mantine/core'

// Pages
import { Home } from './pages/Home'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MantineProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  </StrictMode>
)
