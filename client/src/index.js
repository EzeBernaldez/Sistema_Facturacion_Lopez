import React from 'react';
import { createRoot } from 'react-dom/client'; 
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './contexts/AuthContext';
import { ChakraProvider } from '@chakra-ui/react';
import { ContextProvider } from './contexts/GlobalContext';

const container = document.getElementById('root');
const root = createRoot(container); 

root.render(
  <React.StrictMode>
    <ChakraProvider>
      <ContextProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
      </ContextProvider>
    </ChakraProvider>
  </React.StrictMode>
);

reportWebVitals();
