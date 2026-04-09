import { Analytics } from "@vercel/analytics/react";
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { RootErrorBoundary } from '@/ui/components/errors/RootErrorBoundary';
import './index.css';
import { router } from './routes';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootErrorBoundary>
      <RouterProvider router={router} />
      <Analytics />
    </RootErrorBoundary>
  </StrictMode>,
);