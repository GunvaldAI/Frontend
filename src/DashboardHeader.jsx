import React, { useState } from 'react';
import { useClerk, SignedIn, SignedOut, useUser } from '@clerk/clerk-react';

/**
 * DashboardHeader component provides a white top bar for the dashboard pages.
 * It mirrors the Readdy dashboard header design with a search input,
 * notification bell and profile menu.  When the user is signed out a
 * simple sign‑in button is shown; when signed in the user's avatar is
 * displayed with a dropdown menu for profile actions and sign out.  A
 * minimal notification dropdown is included for aesthetics but can be
 * extended to show real notifications.  This header should be used
 * exclusively on dashboard pages (e.g. /dashboard, /dashboard/profile,
 * /dashboard/posts) and not on the marketing pages.
 */
const DashboardHeader = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { signOut } = useClerk();
  const { user } = useUser();
  const avatarUrl = user?.imageUrl || 'https://readdy.ai/api/search-image?query=Professional%20avatar&width=100&height=100&seq=profile001&orientation=squarish';

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: logo */}
        <div className="flex items-center space-x-4">
          <a href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg">
              <i className="ri-robot-2-line text-white text-lg"></i>
            </div>
            <span className="text-xl font-bold text-gray-900">Gunvald</span>
          </a>
        </div>
        {/* Right: search, notifications and profile */}
        <div className="flex items-center space-x-4">
          {/* Search bar */}
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Haku..."
              className="w-64 px-4 py-2 text-sm bg-gray-100 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 flex items-center justify-center">
              <i className="ri-search-line text-gray-400 text-sm"></i>
            </div>
          </div>
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 relative"
            >
              <i className="ri-notification-3-line text-xl"></i>
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></div>
            </button>
            {showNotifications && (
              <div className="absolute right-0 top-12 w-72 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900 text-sm">Ilmoitukset</h3>
                </div>
                <div className="max-h-60 overflow-y-auto divide-y divide-gray-100">
                  {/* Placeholder notifications */}
                  <div className="px-4 py-3 flex items-start space-x-3 hover:bg-gray-50 cursor-pointer">
                    <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full">
                      <i className="ri-check-line text-blue-600 text-sm"></i>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Postaus ajastettu onnistuneesti</p>
                      <p className="text-xs text-gray-500">Hetki sitten</p>
                    </div>
                  </div>
                  <div className="px-4 py-3 flex items-start space-x-3 hover:bg-gray-50 cursor-pointer">
                    <div className="w-8 h-8 flex items-center justify-center bg-green-100 rounded-full">
                      <i className="ri-trending-up-line text-green-600 text-sm"></i>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">Julkaisusi kerää huomiota!</p>
                      <p className="text-xs text-gray-500">1 tunti sitten</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* Profile or sign in */}
          <SignedIn>
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <img
                  src={avatarUrl}
                  alt="Profiili"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className="ri-arrow-down-s-line text-gray-600 text-sm"></i>
                </div>
              </button>
              {showProfile && (
                <div className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <a href="/dashboard/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Profiilin asetukset
                  </a>
                    <a href="/pricing" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    Hinnoittelu
                  </a>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={async () => {
                      await signOut();
                      // redirect to home after sign out
                      window.location.href = '/';
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Kirjaudu ulos
                  </button>
                </div>
              )}
            </div>
          </SignedIn>
          <SignedOut>
            <div className="flex items-center space-x-2">
              <a href="/sign-in" className="text-sm text-gray-700 hover:text-gray-900 px-3 py-2">
                Kirjaudu sisään
              </a>
              <a href="/sign-up" className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-lg">
                Aloita nyt
              </a>
            </div>
          </SignedOut>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;