// Initialize PostHog analytics for the frontend application.
// This module reads configuration from Vite environment variables and sets up PostHog.

import posthog from 'posthog-js';

// Retrieve PostHog key and host from environment variables.
// VITE_POSTHOG_KEY should be defined in the Vercel project settings for production
// and in a .env file for local development. VITE_POSTHOG_HOST can override the
// default PostHog cloud host if you are using a self-hosted instance.
const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com';

// Only initialize PostHog if a key is provided. This prevents runtime errors
// during local development or in preview deployments where analytics might not be needed.
if (POSTHOG_KEY) {
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    autocapture: true,
    loaded: (ph) => {
      console.log('PostHog loaded:', ph);
      // Capture an initial pageview event once PostHog is loaded.
      ph.capture('page_load');
    },
  });
}

export default posthog;