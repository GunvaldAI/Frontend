import React from 'react';
// Import Clerk components and hooks to conditionally render
// authentication controls and perform sign‑out actions.
import { SignedIn, SignedOut, useClerk } from '@clerk/clerk-react';

// Simple home page styled with Tailwind CSS to emulate a modern SaaS landing page.
// This component displays a header with navigation, a hero section and a footer.
const App = () => {
  const currentYear = new Date().getFullYear();
  // Access the Clerk instance to call signOut when needed.
  const { signOut } = useClerk();
  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header with logo and auth buttons */}
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow">
        <div className="text-2xl font-bold text-indigo-700">Gunvald</div>
        {/* When the user is signed out, show sign‑in and sign‑up links. */}
        <SignedOut>
          <div className="space-x-4">
            <a href="/sign-in" className="text-indigo-700 font-semibold hover:underline">
              Kirjaudu sisään
            </a>
            <a
              href="/sign-up"
              className="px-4 py-2 bg-indigo-700 text-white rounded hover:bg-indigo-800 transition"
            >
              Rekisteröidy
            </a>
          </div>
        </SignedOut>
        {/* When the user is signed in, offer a sign‑out button. */}
        <SignedIn>
          <button
            onClick={async () => {
              try {
                await signOut();
              } finally {
                // After signing out, redirect to the home page.
                window.location.href = '/';
              }
            }}
            className="px-4 py-2 bg-indigo-700 text-white rounded hover:bg-indigo-800 transition"
          >
            Kirjaudu ulos
          </button>
        </SignedIn>
      </header>
      {/* Hero section with gradient background and call‑to‑action */}
      <main className="flex-grow bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
        <div className="text-center text-white px-6">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">Gunvald</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Tekoälyavusteinen sosiaalisen median assistentti. Luo ja hallinnoi sisältöä nopeasti ja tehokkaasti.
          </p>
          {/* When signed out, show call‑to‑action buttons to sign up or sign in. */}
          <SignedOut>
            <div className="space-x-4">
              <a
                href="/sign-up"
                className="bg-white text-gray-800 font-semibold py-3 px-8 rounded-full shadow hover:bg-gray-200 transition"
              >
                Aloita nyt
              </a>
              <a
                href="/sign-in"
                className="border border-white text-white font-semibold py-3 px-8 rounded-full hover:bg-white hover:text-gray-800 transition"
              >
                Kirjaudu sisään
              </a>
            </div>
          </SignedOut>
          {/* When signed in, offer an action or just show the hero text without CTA. */}
          <SignedIn>
            <div className="space-x-4">
              <button
                onClick={async () => {
                  try {
                    await signOut();
                  } finally {
                    window.location.href = '/';
                  }
                }}
                className="border border-white text-white font-semibold py-3 px-8 rounded-full hover:bg-white hover:text-gray-800 transition"
              >
                Kirjaudu ulos
              </button>
            </div>
          </SignedIn>
        </div>
      </main>
      {/* Footer with basic links */}
      <footer className="bg-gray-100 py-6 text-center text-gray-600">
        <p className="mb-2">&copy; {currentYear} Gunvald. Kaikki oikeudet pidätetään.</p>
        <div className="space-x-4">
          <a href="#" className="hover:underline">
            Tietoja
          </a>
          <a href="#" className="hover:underline">
            Yhteystiedot
          </a>
          <a href="#" className="hover:underline">
            Ehdot
          </a>
        </div>
      </footer>
    </div>
  );
};

export default App;