import React from 'react';
import App from './App';
import WalletContextWrapper from './contexts/wallet';
import BotSettingsContextWrapper from './contexts/bot-settings';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from './theme';
import TokensContextWrapper from './contexts/tokens';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container!)
root.render(
  <React.StrictMode>
    <WalletContextWrapper>
      <BotSettingsContextWrapper>
        <TokensContextWrapper>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </TokensContextWrapper>
      </BotSettingsContextWrapper>
    </WalletContextWrapper>
  </React.StrictMode>,
);
