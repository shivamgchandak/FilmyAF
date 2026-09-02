import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { store } from './redux/store.js';
import App from './App.jsx';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: 'var(--surface-hi)',
              color: 'var(--t1)',
              border: '1px solid var(--border-strong)',
              borderRadius: '2px',
              fontFamily: 'var(--font-sans)',
              fontSize: '14px',
              boxShadow: 'var(--shadow-md)',
            },
            success: { iconTheme: { primary: '#2D7A4F', secondary: 'var(--bg)' } },
            error: { iconTheme: { primary: '#D6294B', secondary: 'var(--bg)' } },
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
