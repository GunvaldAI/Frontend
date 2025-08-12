// Sentry client-side initialization for the Gunvald frontend.
// This module sets up Sentry to capture errors and performance data in the browser.
// To enable Sentry, provide a VITE_SENTRY_DSN environment variable in Vercel or your local .env file.

import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

// Initialize Sentry only if a DSN is provided. Without a DSN the SDK will be
// effectively disabled and no events will be sent. Adjust the
// `tracesSampleRate` to a lower value (e.g. 0.1) in production to limit the
// volume of performance data captured.
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN || '',
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0,
});