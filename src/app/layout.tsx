'use client';

import { ReactNode } from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import LayoutWithSidebar from '@/components/LayoutWithSidebar';
import theme from '@/lib/theme';
import './globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <LayoutWithSidebar>{children}</LayoutWithSidebar>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
