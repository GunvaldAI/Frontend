// Entry point for the Gunvald frontend application.
// This file bootstraps the React app and integrates Clerk for authentication.
// It ensures that visitors stay on the gunvald.fi domain for sign‑in and sign‑up.

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './analytics';
import './sentry';

import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignIn,
  SignUp,
} from '@clerk/clerk-react';

// Retrieve Clerk publishable key from environment variables.
const clerkPubKey =
  import.meta.env?.VITE_CLERK_PUBLISHABLE_KEY ||
  import.meta.env?.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Detect missing or placeholder keys for development.
const isPlaceholderKey =
  !clerkPubKey ||
  /your-.*clerk.*publishable.*key/i.test(String(clerkPubKey).trim());

const rootElement = document.getElementById('root');

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
          {/* Show auth pages only on dedicated routes; otherwise display the home page */}
          {window.location.pathname === '/sign-up' ? (
            <SignUp
              routing="path"
              path="/sign-up"
              signInUrl="/sign-in"
              afterSignUpUrl="/"
            />
          ) : window.location.pathname === '/sign-in' ? (
            <SignIn
              routing="path"
              path="/sign-in"
              signUpUrl="/sign-up"
              afterSignInUrl="/"
            />
          ) : (
            <App />
          )}
        </SignedOut>
      </ClerkProvider>
    </React.StrictMode>
  );
}