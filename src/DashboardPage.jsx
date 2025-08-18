import React, { useState } from 'react';
import { SignedIn, SignedOut, useClerk } from '@clerk/clerk-react';
import ProfilePage from './ProfilePage.jsx';
import ActionPage from './ActionPage.jsx';

/**
 * Dashboard page inspired by the Readdy design.  The dashboard is split
 * into a sidebar for navigation and a main content area.  The sidebar
 * contains links to the overview, profile and post generation pages.
 * Clicking a link updates the active tab without performing a full page
 * navigation.  The overview page displays placeholder statistics and a
 * simple list of recent posts.  The profile and posts tabs render
 * existing components (ProfilePage and ActionPage) to preserve
 * functionality.  All labels are presented in Finnish.
 */
const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { signOut } = useClerk();

  // Placeholder data for the overview statistics and recent posts.  In a
  // production system these values would be fetched from an API.
  const stats = [
    { label: 'Postauksia yhteensä', value: 42, icon: 'ri-file-text-line', color: 'bg-indigo-100 text-indigo-700' },
    { label: 'Ajastettuja', value: 12, icon: 'ri-timer-line', color: 'bg-green-100 text-green-700' },
    { label: 'Luonnoksia', value: 5, icon: 'ri-edit-box-line', color: 'bg-yellow-100 text-yellow-700' },
    { label: 'Näyttökerrat', value: '1.2k', icon: 'ri-eye-line', color: 'bg-purple-100 text-purple-700' },
  ];
  const recentPosts = [
    { id: 1, channel: 'LinkedIn', title: 'Tuottavuusvinkit pienyrittäjälle', status: 'Julkaistu', engagement: '120 tykkäystä', date: '1 päivä sitten' },
    { id: 2, channel: 'Instagram', title: 'Upea auringonnousu ja aamukahvi', status: 'Ajastettu', engagement: '-', date: 'Huomenna' },
    { id: 3, channel: 'Facebook', title: 'Uusi blogipostaus: AI‑sosiaalinen media', status: 'Luonnos', engagement: '-', date: '-' },
  ];

  // Render the main content based on the selected tab.
  const renderContent = () => {
    if (activeTab === 'profile') {
      return <ProfilePage />;
    }
    if (activeTab === 'posts') {
      return <ActionPage />;
    }
    // Overview: show statistics and recent posts
    return (
      <div className="space-y-8">
        {/* Statistics grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex items-center p-5 bg-white border border-gray-200 rounded-xl shadow-sm">
              <div className={`w-12 h-12 flex items-center justify-center rounded-lg mr-4 ${stat.color}`}>
                <i className={`${stat.icon} text-xl`}></i>
              </div>
              <div>
                <div className="text-xl font-semibold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
        {/* Recent posts table */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Viimeisimmät postaukset</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kanava</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Otsikko</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tila</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sitoutuneisuus</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Päivämäärä</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center space-x-2">
                      <i className="ri-share-box-line text-gray-500"></i>
                      <span>{post.channel}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{post.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.engagement}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-60 md:w-64 bg-gray-50 border-r border-gray-200 py-6 px-4 flex-shrink-0">
        <div className="mb-8">
          <a href="/" className="text-2xl font-bold text-gray-900">Gunvald</a>
        </div>
        <nav className="space-y-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'overview' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <i className="ri-dashboard-line mr-3"></i>
            Yleiskatsaus
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'profile' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <i className="ri-user-line mr-3"></i>
            Profiili
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`w-full flex items-center px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'posts' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <i className="ri-magic-line mr-3"></i>
            Postaukset
          </button>
          <SignedIn>
            <button
              onClick={async () => {
                try {
                  await signOut();
                } finally {
                  window.location.href = '/';
                }
              }}
              className="w-full flex items-center px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              <i className="ri-logout-box-line mr-3"></i>
              Kirjaudu ulos
            </button>
          </SignedIn>
        </nav>
      </aside>
      {/* Main content */}
      <div className="flex-1 bg-gray-50">
        {/* Top bar */}
        <div className="border-b border-gray-200 py-4 px-6 flex justify-between items-center bg-white">
          <h1 className="text-2xl font-bold text-gray-900">
            {activeTab === 'overview' ? 'Yleiskatsaus' : activeTab === 'profile' ? 'Profiili' : 'Postaukset'}
          </h1>
        </div>
        <div className="p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;