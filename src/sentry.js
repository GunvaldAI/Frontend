// Modified Sentry client-side initialization for the Gunvald frontend.
// Only initialize Sentry when a DSN is provided to avoid invalid placeholder keys.

import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

// Retrieve DSN from environment. If not provided, Sentry will remain disabled.
const dsn = import.meta.env?.VITE_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
  });
} else {
  // No DSN provided; Sentry will remain disabled.
  console.info('[sentry] DSN not provided; Sentry disabled.');
}