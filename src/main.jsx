// This file boots the React application and integrates Clerk for authentication.
// It replaces the default sign‑in and sign‑up experience with Clerk-hosted
// components that live on the same domain, ensuring users never leave
// gunvald.fi during authentication. When no valid Clerk publishable key is
// present, the app renders without Clerk to support development scenarios.

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './analytics';
import './sentry';

// Clerk imports for authentication. We import both SignIn and SignUp so
// that the correct component can be shown based on the current path.
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
} from '@clerk/clerk-react';

// Retrieve Clerk publishable key from environment. This supports both Vite
// (`VITE_CLERK_PUBLISHABLE_KEY`) and Next.js (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`)
// naming conventions so the same code can run in different build tools.
const clerkPubKey =
  import.meta.env?.VITE_CLERK_PUBLISHABLE_KEY ||
  import.meta.env?.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Simple helper to detect if the key is missing or obviously a placeholder.
const isPlaceholderKey =
  !clerkPubKey ||
  /your-.*clerk.*publishable.*key/i.test(String(clerkPubKey).trim());

const rootElement = document.getElementById('root');

// If no valid publishable key is provided, skip Clerk entirely. This keeps
// development environments running without external dependencies.
if (isPlaceholderKey) {
  console.warn(
    '[clerk] Missing or placeholder publishable key detected; rendering app without Clerk.'
  );
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  // With a valid key, mount the application inside ClerkProvider. We use
  // history.pushState for navigation to avoid full page reloads.
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ClerkProvider
        publishableKey={clerkPubKey}
        navigate={(to) => window.history.pushState(null, '', to)}
      >
        <SignedIn>
          {/* Render the main app when the user is signed in */}
          <App />
        </SignedIn>
        <SignedOut>
          {/* Display SignUp when the path is /sign-up; otherwise show SignIn.
              After authentication completes, redirect to the home page. */}
          {window.location.pathname === '/sign-up' ? (
            <SignUp
              routing="path"
              path="/sign-up"
              signInUrl="/sign-in"
              afterSignUpUrl="/"
            />
          ) : (
            <SignIn
              routing="path"
              path="/sign-in"
              signUpUrl="/sign-up"
              afterSignInUrl="/"
            />
          )}
        </SignedOut>
      </ClerkProvider>
    </React.StrictMode>
  );
}