import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Ocultar splash screen una vez que React montó
setTimeout(() => {
  if (window.__hideSplash) window.__hideSplash();
}, 300);
