import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { HotelProvider } from './context/HotelContext.jsx' // Add this import
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <AuthProvider>
      <HotelProvider> {/* Add this wrapper */}
        <App />
      </HotelProvider>
    </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)