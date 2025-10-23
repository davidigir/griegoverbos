import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';

// 1. IMPORTAR FUNCIONES DE FIREBASE
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB_PxMU0FdbZlsKf-AcNivbJdDF8togtqc",
  authDomain: "griegousc.firebaseapp.com",
  projectId: "griegousc",
  storageBucket: "griegousc.firebasestorage.app",
  messagingSenderId: "141971955595",
  appId: "1:141971955595:web:ce4e8238d516c2383e598e",
  measurementId: "G-959ZJ6STNY"
};
// 3. INICIALIZAR Y EXPORTAR
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app); // Usamos 'export const'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();