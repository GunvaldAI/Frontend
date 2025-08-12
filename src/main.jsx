import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
// Initialize PostHog analytics. This import will automatically
// set up PostHog using environment variables defined in Vercel or .env.
import './analytics';

// Clerk imports for authentication
import { ClerkProvider, SignedIn, SignedOut, SignIn } from '@clerk/clerk-react';

// Retrieve Clerk publishable key from environment
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey} navigate={(to) => window.history.pushState(null, '', to)}>
      <SignedIn>
        <App />
      </SignedIn>
      <SignedOut>
        {/* Show the Clerk SignIn component if user is not signed in */}
        <SignIn routing="path" path="/sign-in" signUpFallbackRedirect={"/"} />
      </SignedOut>
    </ClerkProvider>
  </React.StrictMode>
);