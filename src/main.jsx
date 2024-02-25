import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { PagesProvider } from './PagesContext.jsx'
import { TokenProvider } from './TokenContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TokenProvider>
      <PagesProvider>
        <App />
      </PagesProvider>
    </TokenProvider>
  </React.StrictMode>,
)
