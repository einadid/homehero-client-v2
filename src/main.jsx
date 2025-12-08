// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import ThemeProvider from './providers/ThemeProvider';
import AuthProvider from './providers/AuthProvider';
import router from './routes/Routes';
import './index.css';
import ErrorBoundary from './components/ErrorBoundary';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Custom toast styles
const toastOptions = {
  duration: 4000,
  style: {
    borderRadius: '12px',
    padding: '16px',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
  },
  success: {
    style: {
      background: '#10b981',
      color: '#fff',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#10b981',
    },
  },
  error: {
    style: {
      background: '#ef4444',
      color: '#fff',
    },
    iconTheme: {
      primary: '#fff',
      secondary: '#ef4444',
    },
  },
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
        <ErrorBoundary>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster position="top-right" toastOptions={toastOptions} />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
        </ErrorBoundary>
  </React.StrictMode>
);