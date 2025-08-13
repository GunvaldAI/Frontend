// Modified PostHog analytics initialization for the Gunvald frontend.
// This module reads configuration from environment variables and sets up PostHog only
// when a valid key is provided. It supports both Vite and Next naming conventions.

import posthog from 'posthog-js';

// Retrieve PostHog key and host from environment variables.
const POSTHOG_KEY =
  import.meta.env?.VITE_POSTHOG_KEY ||
  import.meta.env?.NEXT_PUBLIC_POSTHOG_KEY;

const POSTHOG_HOST =
  import.meta.env?.VITE_POSTHOG_HOST ||
  import.meta.env?.NEXT_PUBLIC_POSTHOG_HOST ||
  'https://app.posthog.com';

// Initialize PostHog only if a non-placeholder key is provided.
if (POSTHOG_KEY && !/your-posthog-key/i.test(String(POSTHOG_KEY).trim())) {
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    autocapture: true,
    loaded: (ph) => {
      console.log('PostHog loaded:', ph);
      // Capture an initial pageview event once PostHog is loaded.
      ph.capture('page_load');
    },
  });
} else {
  // No valid PostHog key provided; analytics will remain disabled.
  console.info('[posthog] PostHog key not provided or is a placeholder; analytics disabled.');
}

export default posthog;