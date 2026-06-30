import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './redux/store.js';
import { SocketProvider } from './context/SocketContext.jsx';
import AppRouter from './routes/AppRouter.jsx';
import RozgarAI from './components/RozgarAI';

export default function App() {
  return (
    <Provider store={store}>
      <SocketProvider>
        <BrowserRouter>
          {/* Toast notifications container */}
          <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
              duration: 4000,
              style: {
                background: '#333',
                color: '#fff',
                borderRadius: '12px',
                fontSize: '14px',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
            }}
          />
          {/* Navigation Router mapping */}
          <AppRouter />
          {/* Floating AI Assistant Widget */}
          <RozgarAI />
        </BrowserRouter>
      </SocketProvider>
    </Provider>
  );
}
