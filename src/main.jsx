import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './contexts/AuthContext'
import { EventProvider } from './contexts/EventContext'
import { Toaster } from 'react-hot-toast'
import FirebaseSetup from './components/FirebaseSetup.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <EventProvider>
          <App />
          <Toaster position="top-right" />
          <FirebaseSetup />
        </EventProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)