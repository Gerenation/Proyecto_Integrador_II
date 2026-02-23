import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

/**
 * Punto de entrada de la aplicación React
 * 
 * Renderiza el componente App en el elemento con id "root"
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
