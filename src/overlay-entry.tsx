/**
 * Overlay entry point - renders CrosshairOverlayApp
 * for the transparent fullscreen crosshair layer window.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { CrosshairOverlayApp } from './CrosshairOverlayApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CrosshairOverlayApp />
  </StrictMode>,
)
