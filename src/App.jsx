import React from 'react';
// Import Clerk components and hooks to conditionally render
// authentication controls and perform sign‑out actions.
import { SignedIn, SignedOut, useClerk } from '@clerk/clerk-react';

// Simple home page styled with Tailwind CSS to emulate a modern SaaS landing page.
// This component displays a header with navigation, a hero section and a footer.
const App = () => {
  const currentYear = new Date().getFullYear();
  const { signOut } = useClerk();
  // Determine the current path so we can render different pages without
  // adding a router dependency. This makes it easy to extend the SPA
  // with additional pages such as profile, action, info, contact and terms.
  const currentPath = window.location.pathname;

  /**
   * Home page component displaying the hero section with call-to-action
   * buttons when the user is signed out and a sign-out button when signed in.
   */
  const HomePage = () => (
    <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center py-24 flex-grow">
      <div className="text-center text-white px-6">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">Gunvald</h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
          Tekoälyavusteinen sosiaalisen median assistentti. Luo ja hallinnoi sisältöä nopeasti ja tehokkaasti.
        </p>
        {/* Show CTA buttons for unauthenticated visitors */}
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
        {/* When signed in, provide an easy link to the action page */}
        <SignedIn>
          <div className="space-x-4">
            <a
              href="/action"
              className="bg-white text-gray-800 font-semibold py-3 px-8 rounded-full shadow hover:bg-gray-200 transition"
            >
              Luo postaus
            </a>
          </div>
        </SignedIn>
      </div>
    </div>
  );

  /**
   * Profile page component allowing users to enter additional profile
   * information used for generating posts. Currently this is a simple
   * form with local state; integrate with backend as needed.
   */
  const ProfilePage = () => {
    const [name, setName] = React.useState('');
    const [bio, setBio] = React.useState('');
    // Handle form submission; currently just logs to console.
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log('Profile saved:', { name, bio });
      alert('Profiilitiedot tallennettu (tämä on esimerkki).');
    };
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-gray-700">
        <h2 className="text-3xl font-bold mb-6">Täydennä profiili</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1" htmlFor="name">
              Nimi
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-indigo-400"
              placeholder="Syötä nimesi"
            />
          </div>
          <div>
            <label className="block font-medium mb-1" htmlFor="bio">
              Kuvaus
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring focus:border-indigo-400"
              placeholder="Kerro itsestäsi lyhyesti"
              rows={4}
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-700 text-white rounded hover:bg-indigo-800 transition"
          >
            Tallenna
          </button>
        </form>
      </div>
    );
  };

  /**
   * Action page component showing controls to generate social media posts.
   * This is currently a placeholder; integrate actual post generation later.
   */
  const ActionPage = () => (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center text-gray-700">
      <h2 className="text-3xl font-bold mb-4">Generoi julkaisu</h2>
      <p className="mb-6 max-w-lg">
        Täällä voit luoda uusia sosiaalisen median postauksia Gunvald‑avustajan avulla. Tämä toiminnallisuus
        on vielä kehitteillä – pysy kuulolla!
      </p>
      <button
        disabled
        className="px-6 py-3 bg-indigo-300 text-white rounded cursor-not-allowed"
      >
        Generoi postaus (tulossa pian)
      </button>
    </div>
  );

  /** Static pages for info, contact and terms of use */
  const InfoPage = () => (
    <div className="max-w-3xl mx-auto py-12 px-4 text-gray-700">
      <h2 className="text-3xl font-bold mb-4">Tietoja Gunvaldista</h2>
      <p>
        Gunvald on tekoälyavusteinen sosiaalisen median assistentti, joka auttaa sinua luomaan ja hallinnoimaan
        sisältöä nopeasti ja tehokkaasti. Tämä sivu on vielä työn alla, joten lisää tietoa tulossa pian.
      </p>
    </div>
  );
  const ContactPage = () => (
    <div className="max-w-3xl mx-auto py-12 px-4 text-gray-700">
      <h2 className="text-3xl font-bold mb-4">Yhteystiedot</h2>
      <p>Voit ottaa meihin yhteyttä sähköpostitse: <a href="mailto:info@gunvald.fi" className="text-indigo-700 hover:underline">info@gunvald.fi</a>.</p>
    </div>
  );
  const TermsPage = () => (
    <div className="max-w-3xl mx-auto py-12 px-4 text-gray-700">
      <h2 className="text-3xl font-bold mb-4">Käyttöehdot</h2>
      <p>Nämä ovat Gunvaldin käyttöehdot. Tämä sivu on luonnos ja päivittyy pian täydellisillä ehdoilla.</p>
    </div>
  );

  // Select the content component based on currentPath. Default to HomePage.
  let pageComponent;
  switch (currentPath) {
    case '/profile':
      pageComponent = <ProfilePage />;
      break;
    case '/action':
      pageComponent = <ActionPage />;
      break;
    case '/info':
      pageComponent = <InfoPage />;
      break;
    case '/contact':
      pageComponent = <ContactPage />;
      break;
    case '/terms-of-use':
      pageComponent = <TermsPage />;
      break;
    default:
      pageComponent = <HomePage />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header with logo and navigation */}
      <header className="flex justify-between items-center px-8 py-4 bg-white shadow">
        <div className="text-2xl font-bold text-indigo-700">
          <a href="/">Gunvald</a>
        </div>
        {/* When the user is signed out, show auth links */}
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
        {/* When the user is signed in, provide profile and action links plus sign‑out */}
        <SignedIn>
          <div className="space-x-4 flex items-center">
            <a href="/profile" className="text-indigo-700 font-semibold hover:underline">
              Profiili
            </a>
            <a href="/action" className="text-indigo-700 font-semibold hover:underline">
              Postaukset
            </a>
            <button
              onClick={async () => {
                try {
                  await signOut();
                } finally {
                  window.location.href = '/';
                }
              }}
              className="px-4 py-2 bg-indigo-700 text-white rounded hover:bg-indigo-800 transition"
            >
              Kirjaudu ulos
            </button>
          </div>
        </SignedIn>
      </header>
      {/* Render the selected page component */}
      <main className="flex-grow">
        {pageComponent}
      </main>
      {/* Footer with links to info, contact and terms */}
      <footer className="bg-gray-100 py-6 text-center text-gray-600">
        <p className="mb-2">&copy; {currentYear} Gunvald. Kaikki oikeudet pidätetään.</p>
        <div className="space-x-4">
          <a href="/info" className="hover:underline">
            Tietoja
          </a>
          <a href="/contact" className="hover:underline">
            Yhteystiedot
          </a>
          <a href="/terms-of-use" className="hover:underline">
            Ehdot
          </a>
        </div>
      </footer>
    </div>
  );
};

export default App;