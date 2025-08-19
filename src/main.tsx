import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
// import { BrowserRouter } from 'react-router-dom';
import { HashRouter } from 'react-router-dom';
import App from './App.tsx';
import { AuthProvider } from "./context/AuthContext"; 
import { RequestsProvider } from './context/RequestsContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <AuthProvider>
        <RequestsProvider>
          <App />
        </RequestsProvider>
      </AuthProvider>
    </HashRouter>
  </StrictMode>,
);


// Previously used BrowserRouter, but switched to HashRouter for better compatibility with GitHub Pages
// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     {/* <BrowserRouter> */}
//     <HashRouter>
//       {/* Using HashRouter for better compatibility with GitHub Pages */}
//       <AuthProvider>
//         <RequestsProvider>
//         <App />
//         </RequestsProvider>
//       </AuthProvider>
//     </HashRouter>
//     {/* </BrowserRouter> */}
//   </StrictMode>,
// )
