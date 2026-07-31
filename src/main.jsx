import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './styles/fonts.css'
import './styles/variables.css'
import './styles/global.css'
import App from './App.jsx'
import { ensureGameState } from './firebase/gameState'

ensureGameState().catch((error) => {
  console.error('No se pudo inicializar gameState en Firestore:', error)
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
