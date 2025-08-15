import React from 'react';
// Import Clerk components and hooks to conditionally render
// authentication controls and perform sign‑out actions.
import { SignedIn, SignedOut, useClerk } from '@clerk/clerk-react';
// Import the dedicated ProfilePage component.  This component
// handles loading and saving of the user’s profile and replaces
// the simple stub defined below.
import ProfilePage from './ProfilePage.jsx';
// Import the ActionPage component which handles AI post generation.
import ActionPage from './ActionPage.jsx';

// Simple home page styled with Tailwind CSS to emulate a modern SaaS 
// landing page.
// This component displays a header with navigation, a hero section and a 
// footer.
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
          Tekoälyavusteinen sosiaalisen median assistentti. Luo ja hallinnoi
          sisältöä nopeasti ja tehokkaasti.
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

  // We previously defined a stub ProfilePage component here, but the real
  // implementation is imported above.  The stub has been removed.

  // Note: the ActionPage component is imported at the top of this file.  It
  // provides the UI and logic for generating AI-driven social media posts.

  /** Static pages for info, contact and terms of use */
  const InfoPage = () => (
    <div className="max-w-3xl mx-auto py-12 px-4 text-gray-700">
      <h2 className="text-3xl font-bold mb-4">Tietoja Gunvaldista</h2>
      <p className="mb-4">
        Gunvald on suomalainen startup, joka tarjoaa tekoälyavusteisen sosiaalisen
        median assistentin pienille yrityksille. Palvelumme auttaa sinua
        suunnittelemaan ja tuottamaan kuukauden somepostaukset automaattisesti
        hyödyntämällä OpenAI:n GPT‑malleja tekstien ja kuvien luonnissa.
      </p>
      <p className="mb-4">
        Näet generoidut postaukset kalenterinäkymässä, muokkaat niitä ja hyväksyt
        ennen julkaisua. Gunvald integroituu suosituimpiin some‑kanaviin ja
        tarjoaa analytiikkaa kampanjoidesi tehokkuuden seuraamiseen.
      </p>
      <p>
        Tavoitteenamme on helpottaa yrittäjien arkea ja antaa enemmän aikaa
        keskittyä liiketoiminnan kehittämiseen. Kiitos, että olet mukana!
      </p>
    </div>
  );

  const ContactPage = () => (
    <div className="max-w-3xl mx-auto py-12 px-4 text-gray-700">
      <h2 className="text-3xl font-bold mb-4">Yhteystiedot</h2>
      <p className="mb-2">
        Voit olla meihin yhteydessä seuraavilla tavoilla:
      </p>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          Sähköposti:{' '}
          <a
            href="mailto:info@gunvald.fi"
            className="text-indigo-700 hover:underline"
          >
            info@gunvald.fi
          </a>
        </li>
        <li>Puhelin: +358 50 123 4567</li>
        <li>
          Postiosoite: Gunvald Oy, Tehtaankatu 27–29, 00150 Helsinki, Suomi
        </li>
      </ul>
    </div>
  );

  const TermsPage = () => (
    <div className="max-w-3xl mx-auto py-12 px-4 text-gray-700">
      <h2 className="text-3xl font-bold mb-4">Käyttöehdot</h2>
      <p className="mb-2">
        Käyttämällä Gunvald‑palvelua sitoudut noudattamaan seuraavia ehtoja:
      </p>
      <ol className="list-decimal pl-6 space-y-1">
        <li>
          Palvelu on tarkoitettu sosiaalisen median sisällön suunnitteluun ja
          hallintaan. Et saa käyttää palvelua laittomaan tai sopimattomaan
          tarkoitukseen.
        </li>
        <li>
          Vastaat itse palvelun tuottaman sisällön julkaisemisesta ja varmistat,
          että se noudattaa kunkin sosiaalisen median alustan sääntöjä.
        </li>
        <li>
          Gunvald ei takaa, että tekoälyn luomat tekstit tai kuvat ovat
          virheettömiä, eikä vastaa palvelun kautta luodun sisällön
          mahdollisista seurauksista.
        </li>
        <li>
          Pidätämme oikeuden päivittää näitä ehtoja tarvittaessa. Ajantasaiset
          ehdot löytyvät aina tältä sivulta.
        </li>
      </ol>
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
            <a
              href="/sign-in"
              className="text-indigo-700 font-semibold hover:underline"
            >
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
            <a
              href="/profile"
              className="text-indigo-700 font-semibold hover:underline"
            >
              Profiili
            </a>
            <a
              href="/action"
              className="text-indigo-700 font-semibold hover:underline"
            >
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
      <main className="flex-grow">{pageComponent}</main>
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