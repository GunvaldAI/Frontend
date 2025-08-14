// A simple profile editor React component.  This component loads the
// current user’s profile from the backend and allows them to edit and
// save it.  It assumes that the logged-in user’s Clerk ID is passed
// via the `clerkId` prop.  The component uses the Fetch API to
// communicate with the `/api/profiles` endpoints defined on the
// server.

import React, { useState, useEffect } from 'react';

function ProfilePage({ clerkId }) {
  const [profile, setProfile] = useState({
    company_name: '',
    description: '',
    target_audience: '',
    tone_of_voice: '',
    social_channels: [],
    images: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the profile when the component mounts
  useEffect(() => {
    if (!clerkId) return;
    fetch(`/api/profiles/${clerkId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Profile not found');
        return res.json();
      })
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        // If profile doesn’t exist yet, we leave it empty
        console.warn('Profile not found:', err);
        setLoading(false);
      });
  }, [clerkId]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setError(null);
    const method = profile.id ? 'PUT' : 'POST';
    const url = profile.id ? `/api/profiles/${clerkId}` : '/api/profiles';
    const body = {
      clerk_id: clerkId,
      ...profile,
    };
    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((err) => {
        console.error('Failed to save profile:', err);
        setError('Profiilin tallennus epäonnistui');
      });
  };

  if (loading) return <p>Ladataan profiilia...</p>;

  return (
    <form onSubmit={handleSave} className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Profiili</h1>
      {error && <p className="text-red-600">{error}</p>}
      <div>
        <label className="block mb-1 font-medium" htmlFor="company_name">
          Yrityksen nimi
        </label>
        <input
          id="company_name"
          type="text"
          className="w-full border rounded px-2 py-1"
          value={profile.company_name || ''}
          onChange={handleChange('company_name')}
        />
      </div>
      <div>
        <label className="block mb-1 font-medium" htmlFor="description">
          Kuvaus
        </label>
        <textarea
          id="description"
          className="w-full border rounded px-2 py-1"
          value={profile.description || ''}
          onChange={handleChange('description')}
        />
      </div>
      <div>
        <label className="block mb-1 font-medium" htmlFor="target_audience">
          Kohdeyleisö
        </label>
        <input
          id="target_audience"
          type="text"
          className="w-full border rounded px-2 py-1"
          value={profile.target_audience || ''}
          onChange={handleChange('target_audience')}
        />
      </div>
      <div>
        <label className="block mb-1 font-medium" htmlFor="tone_of_voice">
          Äänen sävy
        </label>
        <input
          id="tone_of_voice"
          type="text"
          className="w-full border rounded px-2 py-1"
          value={profile.tone_of_voice || ''}
          onChange={handleChange('tone_of_voice')}
        />
      </div>
      <div>
        <label className="block mb-1 font-medium" htmlFor="social_channels">
          Somekanavat (pilkuilla erotettuna)
        </label>
        <input
          id="social_channels"
          type="text"
          className="w-full border rounded px-2 py-1"
          value={profile.social_channels?.join(', ') || ''}
          onChange={(e) => {
            const value = e.target.value;
            const channels = value
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean);
            setProfile((prev) => ({ ...prev, social_channels: channels }));
          }}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Tallenna profiili
      </button>
    </form>
  );
}

export default ProfilePage;