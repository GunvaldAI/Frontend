import React, { useState } from 'react';
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
      // Track state of mobile navigation menu so we can show a dropdown on small screens
      const [menuOpen, setMenuOpen] = useState(false);
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

      // Simple card stack to simulate 3D layered cards like those shown on financial product pages.
      // Each card is slightly rotated and offset to create depth.  The front card contains a
      // placeholder label.  You can customise colours and text to suit Gunvald's brand.
      const CardStack = () => (
        <div className="relative w-40 h-28 md:w-64 md:h-40">
          {/* Back card */}
          <div className="absolute top-3 left-2 w-full h-full rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg transform rotate-[-6deg]"></div>
          {/* Middle card */}
          <div className="absolute top-1 left-1 w-full h-full rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg transform rotate-[-3deg]"></div>
          {/* Front card */}
          <div className="absolute inset-0 w-full h-full rounded-xl bg-white shadow-xl flex items-center justify-center text-gray-800 font-semibold">
            AI‑sisällöt
          </div>
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
          <section className="relative z-0 overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 pt-24 pb-32">
            {/* Rotating gradient blob behind the card stack */}
            <div
              className="absolute -top-20 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-purple-400 via-pink-500 to-indigo-500 opacity-60 blur-3xl animate-spin pointer-events-none"
              style={{ animationDuration: '20s' }}
            ></div>
            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center">
              {/* Left column: title, tagline and CTAs */}
              <div className="flex-1 text-center md:text-left text-white">
                <h1 className="text-5xl md:text-6xl font-extrabold mb-4">Gunvald</h1>
                <p className="text-xl md:text-2xl mb-8 max-w-xl mx-auto md:mx-0">
                  Tekoälyavusteinen sosiaalisen median assistentti. Luo, ajasta ja analysoi sisällöt vaivattomasti.
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
              {/* Right column: 3D card stack */}
              <div className="flex-1 flex justify-center mt-12 md:mt-0">
                <CardStack />
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
           {/* Header with responsive navigation */}
           <header className="relative z-50 flex justify-between items-center px-6 py-4 bg-white/90 backdrop-blur shadow">
             {/* Logo */}
             <div className="text-2xl font-bold text-indigo-700">
               <a href="/">Gunvald</a>
             </div>
             {/* Desktop navigation */}
             <nav className="hidden md:flex items-center space-x-4">
               <SignedOut>
                 <a href="/sign-in" className="text-indigo-700 font-semibold hover:underline">
                   Kirjaudu sisään
                 </a>
                 <a
                   href="/sign-up"
                   className="px-4 py-2 bg-indigo-700 text-white rounded hover:bg-indigo-800 transition"
                 >
                   Rekisteröidy
                 </a>
               </SignedOut>
               <SignedIn>
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
               </SignedIn>
             </nav>
             {/* Mobile menu toggle */}
             <button
               className="md:hidden text-indigo-700 focus:outline-none"
               onClick={() => setMenuOpen(!menuOpen)}
               aria-label={menuOpen ? 'Sulje valikko' : 'Avaa valikko'}
             >
               {/* Hamburger and close icons */}
               {!menuOpen ? (
                 <svg
                   xmlns="http://www.w3.org/2000/svg"
                   fill="none"
                   viewBox="0 0 24 24"
                   strokeWidth={1.5}
                   stroke="currentColor"
                   className="w-7 h-7"
                 >
                   <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
                 </svg>
               ) : (
                 <svg
                   xmlns="http://www.w3.org/2000/svg"
                   fill="none"
                   viewBox="0 0 24 24"
                   strokeWidth={1.5}
                   stroke="currentColor"
                   className="w-7 h-7"
                 >
                   <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                 </svg>
               )}
             </button>
             {/* Mobile navigation dropdown */}
             {menuOpen && (
               <div className="absolute right-4 top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 md:hidden">
                 <SignedOut>
                   <a
                     href="/sign-in"
                     className="block px-4 py-2 text-indigo-700 font-semibold hover:bg-gray-100"
                     onClick={() => setMenuOpen(false)}
                   >
                     Kirjaudu sisään
                   </a>
                   <a
                     href="/sign-up"
                     className="block px-4 py-2 text-indigo-700 font-semibold hover:bg-gray-100"
                     onClick={() => setMenuOpen(false)}
                   >
                     Rekisteröidy
                   </a>
                 </SignedOut>
                 <SignedIn>
                   <a
                     href="/profile"
                     className="block px-4 py-2 text-indigo-700 font-semibold hover:bg-gray-100"
                     onClick={() => setMenuOpen(false)}
                   >
                     Profiili
                   </a>
                   <a
                     href="/action"
                     className="block px-4 py-2 text-indigo-700 font-semibold hover:bg-gray-100"
                     onClick={() => setMenuOpen(false)}
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
                     className="block w-full text-left px-4 py-2 text-indigo-700 font-semibold hover:bg-gray-100"
                   >
                     Kirjaudu ulos
                   </button>
                 </SignedIn>
               </div>
             )}
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