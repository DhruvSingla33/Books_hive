import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './index.css';
import { TeacherProvider } from './components/TeacherContext.jsx';
import { BrowserRouter } from 'react-router-dom'; // ✅ Import this

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  // <BrowserRouter> {/* ✅ Add this wrapper */}
    <TeacherProvider>
      <App />
    </TeacherProvider>
  // </BrowserRouter>
  // </React.StrictMode>
);
