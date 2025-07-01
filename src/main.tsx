import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
// import { BrowserRouter } from 'react-router-dom';
import { HashRouter } from 'react-router-dom';
import App from './App.tsx';
import { AuthProvider } from "./context/AuthContext"; 

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <BrowserRouter> */}
    <HashRouter>
      {/* Using HashRouter for better compatibility with GitHub Pages */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </HashRouter>
    {/* </BrowserRouter> */}
  </StrictMode>,
)
