import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThirdwebProvider } from '@thirdweb-dev/react';
import App from './App';
import './index.css';
// import { myChain } from '../utils/constants';
import { Polygon } from "@thirdweb-dev/chains";

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;

if (!CLIENT_ID) {
  throw new Error("CLIENT_ID is not set in environment variables");
}

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <StrictMode>
    <ThirdwebProvider 
      clientId={CLIENT_ID}
      activeChain={Polygon}
    >
      <App />
    </ThirdwebProvider>
  </StrictMode>
);