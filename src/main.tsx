import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TonConnectUIProvider manifestUrl='https://taiga-labs.github.io/dexlot.json'>
      <App />
    </TonConnectUIProvider>
  </StrictMode>,
);
