import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import '@fontsource-variable/inter/wght.css'

document.documentElement.dataset.theme = localStorage.getItem('wordwork_theme') || 'light'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
