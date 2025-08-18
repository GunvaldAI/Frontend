import React, { useState } from 'react';
import { SignedIn, SignedOut, useClerk } from '@clerk/clerk-react';

/**
 * Header component inspired by the Readdy design.  Displays a logo, navigation
 * links and call‑to‑action buttons.  The navigation adapts for desktop and
 * mobile and integrates Gunvald's authentication using Clerk.  When the
 * user is signed out, "Kirjaudu sisään" and "Aloita nyt" buttons are
 * displayed; when signed in, the header shows a "Luo postaus" button and
 * a sign‑out control.
 */
const ReaddyHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { signOut } = useClerk();
  return (
    <header className="bg-transparent backdrop-blur-md border-b border-white/20 shadow-sm relative">
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 flex items-center justify-between py-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <a href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
              <i className="ri-robot-2-line text-white text-lg"></i>
            </div>
            <span className="text-xl font-bold text-gray-900">Gunvald</span>
          </a>
        </div>
        {/* Navigation – desktop */}
        <nav className="hidden lg:flex items-center space-x-1">
          <a href="/dashboard" className="text-gray-700 hover:text-gray-900 transition-colors duration-200 text-sm font-medium px-3 py-2 rounded-md hover:bg-white/30">
            Dashboard
          </a>
          <a href="/dashboard/scheduler" className="text-gray-700 hover:text-gray-900 transition-colors duration-200 text-sm font-medium px-3 py-2 rounded-md hover:bg-white/30">
            Scheduler
          </a>
          <a href="/dashboard/analytics" className="text-gray-700 hover:text-gray-900 transition-colors duration-200 text-sm font-medium px-3 py-2 rounded-md hover:bg-white/30">
            Analytics
          </a>
          <a href="/pricing" className="text-gray-700 hover:text-gray-900 transition-colors duration-200 text-sm font-medium px-3 py-2 rounded-md hover:bg-white/30">
            Pricing
          </a>
        </nav>
        {/* CTA buttons – desktop */}
        <div className="hidden lg:flex items-center space-x-3">
          <SignedOut>
            <>
              <a href="/sign-in" className="text-gray-700 hover:text-gray-900 transition-colors duration-200 text-sm font-medium px-4 py-2 whitespace-nowrap">
                Kirjaudu sisään
              </a>
              <a href="/sign-up" className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 whitespace-nowrap shadow-lg">
                Aloita nyt
              </a>
            </>
          </SignedOut>
          <SignedIn>
            <>
              <a href="/action" className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 whitespace-nowrap shadow-lg">
                Luo postaus
              </a>
              <button onClick={() => signOut()} className="text-gray-700 hover:text-gray-900 transition-colors duration-200 text-sm font-medium px-4 py-2 whitespace-nowrap">
                Kirjaudu ulos
              </button>
            </>
          </SignedIn>
        </div>
        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden w-10 h-10 flex items-center justify-center text-gray-700 hover:text-gray-900 hover:bg-white/30 rounded-lg transition-all duration-200"
        >
          <i className={`${menuOpen ? 'ri-close-line' : 'ri-menu-line'} text-xl`}></i>
        </button>
      </div>
      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden py-4 border-t border-white/20">
          <nav className="flex flex-col space-y-1 px-6">
            <a href="/dashboard" className="text-gray-700 hover:text-gray-900 transition-colors duration-200 text-sm font-medium px-4 py-3 rounded-lg hover:bg-white/30">
              Dashboard
            </a>
            <a href="/dashboard/scheduler" className="text-gray-700 hover:text-gray-900 transition-colors duration-200 text-sm font-medium px-4 py-3 rounded-lg hover:bg-white/30">
              Scheduler
            </a>
            <a href="/dashboard/analytics" className="text-gray-700 hover:text-gray-900 transition-colors duration-200 text-sm font-medium px-4 py-3 rounded-lg hover:bg-white/30">
              Analytics
            </a>
            <a href="/pricing" className="text-gray-700 hover:text-gray-900 transition-colors duration-200 text-sm font-medium px-4 py-3 rounded-lg hover:bg-white/30">
              Pricing
            </a>
            <div className="flex flex-col space-y-2 pt-4 border-t border-white/20">
              <SignedOut>
                <>
                  <a href="/sign-in" className="text-gray-700 hover:text-gray-900 transition-colors duration-200 text-sm font-medium px-4 py-3 rounded-lg hover:bg-white/30">
                    Kirjaudu sisään
                  </a>
                  <a href="/sign-up" className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 text-center whitespace-nowrap shadow-lg">
                    Aloita nyt
                  </a>
                </>
              </SignedOut>
              <SignedIn>
                <>
                  <a href="/action" className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 text-center whitespace-nowrap shadow-lg">
                    Luo postaus
                  </a>
                  <button onClick={() => signOut()} className="text-gray-700 hover:text-gray-900 transition-colors duration-200 text-sm font-medium px-4 py-3 rounded-lg hover:bg-white/30 text-left">
                    Kirjaudu ulos
                  </button>
                </>
              </SignedIn>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default ReaddyHeader;