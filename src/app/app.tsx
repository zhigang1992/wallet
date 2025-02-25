import { Suspense } from 'react';
import { Provider as ReduxProvider } from 'react-redux';

import { ColorModeProvider as ColorModeProviderLegacy, ThemeProvider } from '@stacks/ui';
import { QueryClientProvider } from '@tanstack/react-query';
import { PersistGate } from 'redux-persist/integration/react';

import { queryClient } from '@app/common/persistence';
import { theme } from '@app/common/theme';
import { GlobalStyles } from '@app/components/global-styles/global-styles';
import { FullPageLoadingSpinner, NewAccountLoadingSpinner } from '@app/components/loading-spinner';
import { Devtools } from '@app/features/devtool/devtools';
import { AppErrorBoundary } from '@app/features/errors/app-error-boundary';
import { AppRoutes } from '@app/routes/app-routes';
import { persistor, store } from '@app/store';

import { ThemeSwitcherProvider } from './common/theme-provider';
import './index.css';

const reactQueryDevToolsEnabled = process.env.REACT_QUERY_DEVTOOLS_ENABLED === 'true';

const ColorModeProvider = ColorModeProviderLegacy as any;

export function App() {
  return (
    <ReduxProvider store={store}>
      <PersistGate loading={<FullPageLoadingSpinner />} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <ThemeSwitcherProvider>
            <GlobalStyles />
            <QueryClientProvider client={queryClient}>
              <ColorModeProvider defaultMode="light">
                <Suspense fallback={<NewAccountLoadingSpinner />}>
                  <AppErrorBoundary>
                    <AppRoutes />
                  </AppErrorBoundary>
                  {reactQueryDevToolsEnabled && <Devtools />}
                </Suspense>
              </ColorModeProvider>
            </QueryClientProvider>
          </ThemeSwitcherProvider>
        </ThemeProvider>
      </PersistGate>
    </ReduxProvider>
  );
}
