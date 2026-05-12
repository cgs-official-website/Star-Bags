import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import {AdminDashboard} from '../pages/Admin/AdminDashboard.jsx'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
