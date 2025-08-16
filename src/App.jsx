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

// Home page, static information pages and header/footer definitions.
// This file defines a custom landing page with a hero section, animated graphic,
// introduction, how it works, benefits and a placeholder video section.

const App = () => {
  const currentYear = new Date().getFullYear();
  const { signOut } = useClerk();
  // Determine the current path so we can render different pages without
  // adding a router dependency. This makes it easy to extend the SPA
  // with additional pages such as profile, action, info, contact and terms.
  const currentPath = window.location.pathname;

  // Simple animated graphic using a rotating gradient blob.  Tailwind's animate-spin
  // utility spins the element; we override the duration for a slower, smoother rotation.
  const HeroAnimation = () => (
    <div className="relative w-48 h-48 md:w-64 md:h-64">
      <div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 via-pink-500 to-indigo-500 opacity-70 blur-3xl animate-spin"
        style={{ animationDuration: '12s' }}
      ></div>
    </div>
  );

  /**
   * Landing page component.  Displays the hero section with call‑to‑action and
   * animation, followed by informative sections describing the service,
   * explaining the workflow, highlighting benefits and embedding a placeholder
   * video.  When the user is signed out, it encourages sign up; when signed in,
   * it offers quick access to the post generator.
   */
  const HomePage = () => (
    <div className="flex flex-col">
      {/* Hero section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 py-20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center">
          {/* Left column: title, tagline and CTAs */}
          <div className="flex-1 text-center md:text-left text-white">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4">Gunvald</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-xl mx-auto md:mx-0">
              Tekoälyavusteinen sosiaalisen median assistentti. Luo ja hallinnoi sisältöä
              nopeasti ja tehokkaasti.
            </p>
            <SignedOut>
              <div className="space-x-4 mb-8">
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
            <SignedIn>
              <div className="mb-8">
                <a
                  href="/action"
                  className="bg-white text-gray-800 font-semibold py-3 px-8 rounded-full shadow hover:bg-gray-200 transition"
                >
                  Luo postaus
                </a>
              </div>
            </SignedIn>
          </div>
          {/* Right column: animation */}
          <div className="flex-1 flex justify-center mt-12 md:mt-0">
            <HeroAnimation />
          </div>
        </div>
      </section>
      {/* Introduction section */}
      <section className="bg-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-indigo-700">Mikä on Gunvald?</h2>
          <p className="text-gray-700 mb-6">
            Gunvald on suomalainen tekoälyavusteinen sosiaalisen median assistentti. Palvelumme
            generoi kuukauden somepostaukset puolestasi, ehdottaa kuvia ja otsikoita ja
            integroituu somekanaviin ajastusta varten.
          </p>
          <ul className="space-y-3 text-gray-700 list-disc list-inside">
            <li>⚙️ Generoi kuukauden somepostaukset tekoälyllä.</li>
            <li>📅 Ajasta sisällöt Buffer‑integraatiolla.</li>
            <li>📊 Seuraa kampanjoiden tehokkuutta analytiikan avulla.</li>
          </ul>
        </div>
      </section>
      {/* How it works section */}
      <section className="bg-gray-50 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-indigo-700">Miten se toimii?</h2>
          <ol className="space-y-3 text-gray-700 list-decimal list-inside">
            <li>
              <span className="font-semibold">Luo profiili:</span> kerro yrityksestäsi, kohdeyleisöstäsi ja
              teemoista.
            </li>
            <li>
              <span className="font-semibold">Generoi ja muokkaa:</span> anna Gunvald generaattorin luoda
              postaukset ja kuvat, muokkaa ne sopiviksi ja hyväksy.
            </li>
            <li>
              <span className="font-semibold">Ajasta ja analysoi:</span> ajasta postaukset suoraan
              somekanaviisi ja seuraa niiden vaikutusta.
            </li>
          </ol>
        </div>
      </section>
      {/* Benefits section */}
      <section className="bg-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-indigo-700">Miten Gunvald helpottaa arkeasi?</h2>
          <p className="text-gray-700 mb-6">
            Gunvald säästää aikaasi ja vaivaasi automatisoimalla sisällön ideoinnin ja
            toteutuksen. Saat laadukkaita julkaisuehdotuksia hetkessä ja voit keskittyä
            olennaiseen – yrityksesi kehittämiseen.
          </p>
        </div>
      </section>
      {/* Video placeholder section */}
      <section className="bg-gray-50 py-12 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-indigo-700">Katso esittelyvideo</h2>
          <div className="w-full max-w-4xl mx-auto">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              {/*
                Embed your own video by replacing the src below with a real video URL.
                For example: https://www.youtube.com/embed/yourVideoId
              */}
              <iframe
                className="absolute inset-0 w-full h-full rounded-lg shadow-lg"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="Gunvald-esittely"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <p className="text-gray-600 mt-4">Tämä on esimerkkivideo – korvaa se omalla esittelyvideollasi.</p>
          </div>
        </div>
      </section>
    </div>
  );

  // Static pages reuse definitions from the previous implementation.
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
      <p className="mb-2">Voit olla meihin yhteydessä seuraavilla tavoilla:</p>
      <ul className="list-disc pl-6 space-y-1">
        <li>
          Sähköposti:{' '}
          <a href="mailto:info@gunvald.fi" className="text-indigo-700 hover:underline">
            info@gunvald.fi
          </a>
        </li>
        <li>Puhelin: +358&nbsp;50&nbsp;123&nbsp;4567</li>
        <li>Postiosoite: Gunvald&nbsp;Oy, Tehtaankatu&nbsp;27–29, 00150 Helsinki, Suomi</li>
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
          Palvelu on tarkoitettu sosiaalisen median sisällön suunnitteluun ja hallintaan.
          Et saa käyttää palvelua laittomaan tai sopimattomaan tarkoitukseen.
        </li>
        <li>
          Vastaat itse palvelun tuottaman sisällön julkaisemisesta ja varmistat, että se
          noudattaa kunkin sosiaalisen median alustan sääntöjä.
        </li>
        <li>
          Gunvald ei takaa, että tekoälyn luomat tekstit tai kuvat ovat virheettömiä, eikä
          vastaa palvelun kautta luodun sisällön mahdollisista seurauksista.
        </li>
        <li>
          Pidätämme oikeuden päivittää näitä ehtoja tarvittaessa. Ajantasaiset ehdot
          löytyvät aina tältä sivulta.
        </li>
      </ol>
    </div>
  );

  // Decide which page to render based on current path.
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
      <main className="flex-grow">{pageComponent}</main>
      {/* Footer */}
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