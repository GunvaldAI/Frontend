// Added comment to trigger redeploy and ensure latest code is used
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './analytics';
import './sentry';

// Clerk imports for authentication
import { ClerkProvider, SignedIn, SignedOut, SignIn } from '@clerk/clerk-react';

// Retrieve Clerk publishable key from environment (support both Vite and Next naming conventions)
const clerkPubKey =
  import.meta.env?.VITE_CLERK_PUBLISHABLE_KEY ||
  import.meta.env?.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Determine if key is missing or a placeholder
const isPlaceholder =
  !clerkPubKey ||
  /your-clerk-publishable-key/i.test(String(clerkPubKey).trim());

const rootElement = document.getElementById('root');

if (isPlaceholder) {
  // No valid publishable key; run without Clerk
  console.warn(
    '[clerk] Missing or placeholder publishable key; rendering app without Clerk.'
  );
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  // Valid publishable key; initialize Clerk
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <ClerkProvider
        publishableKey={clerkPubKey}
        navigate={(to) => window.history.pushState(null, '', to)}
      >
        <SignedIn>
          <App />
        </SignedIn>
        <SignedOut>
          {/* Show the Clerk SignIn component if the user is not signed in */}
          <SignIn routing="path" path="/sign-in" signUpFallbackRedirect={'/'} />
        </SignedOut>
      </ClerkProvider>
    </React.StrictMode>
  );
}