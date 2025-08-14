// A simple profile editor React component.  This component loads the
// current user’s profile from the backend and allows them to edit and
// save it.  It assumes that the logged-in user’s Clerk ID is passed
// via the `clerkId` prop.  The component uses the Fetch API to
// communicate with the `/api/profiles` endpoints defined on the
// server.

import React, { useState, useEffect } from 'react';
// Pull the logged‑in user from Clerk.  This lets the page
// determine the Clerk ID automatically, rather than expecting
// it to be passed in as a prop.  The Clerk ID is needed to
// identify the profile record in the backend.
import { useUser } from '@clerk/clerk-react';

function ProfilePage() {
  // Retrieve the current user from Clerk.  If the user isn’t logged
  // in, we can’t fetch or save a profile.
  const { user } = useUser();
  const clerkId = user?.id;
  const [profile, setProfile] = useState({
    company_name: '',
    description: '',
    target_audience: '',
    tone_of_voice: '',
    social_channels: [],
    marketing_goals: '',
    content_themes: '',
    images: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the profile when the component mounts or when the user
  // changes.  If no profile exists yet, we leave the state with
  // initial values.
  useEffect(() => {
    if (!clerkId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/profiles/${clerkId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Profile not found');
        return res.json();
      })
      .then((data) => {
        // Ensure arrays are proper types
        setProfile({
          company_name: data.company_name || '',
          description: data.description || '',
          target_audience: data.target_audience || '',
          tone_of_voice: data.tone_of_voice || '',
          social_channels: data.social_channels || [],
          marketing_goals: data.marketing_goals || '',
          content_themes: data.content_themes || '',
          images: data.images || [],
        });
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Profile not found or error:', err);
        setLoading(false);
      });
  }, [clerkId]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  // Handle image selection.  Accept between 3 and 10 images and
  // convert them to base64 strings for storage.  If the number of
  // selected images is outside the allowed range, set an error.
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length < 3 || files.length > 10) {
      setError('Valitse 3–10 kuvaa.');
      return;
    }
    Promise.all(
      files.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }),
    )
      .then((base64Images) => {
        setProfile((prev) => ({ ...prev, images: base64Images }));
        setError(null);
      })
      .catch(() => {
        setError('Kuvien käsittely epäonnistui');
      });
  };

  const handleSave = (e) => {
    e.preventDefault();
    setError(null);
    if (!clerkId) {
      setError('Kirjaudu sisään tallentaaksesi profiilin');
      return;
    }
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
      .then((data) => {
        setProfile((prev) => ({ ...prev, id: data.id }));
      })
      .catch((err) => {
        console.error('Failed to save profile:', err);
        setError('Profiilin tallennus epäonnistui');
      });
  };

  if (!user) {
    return <p>Kirjaudu sisään tarkastellaksesi profiilia.</p>;
  }
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
          value={profile.company_name}
          onChange={handleChange('company_name')}
        />
      </div>
      <div>
        <label className="block mb-1 font-medium" htmlFor="description">
          Kuvaus ja ydinviesti
        </label>
        <textarea
          id="description"
          className="w-full border rounded px-2 py-1"
          value={profile.description}
          onChange={handleChange('description')}
        />
        <p className="text-sm text-gray-500">
          Kerro lyhyesti mitä yrityksesi tekee ja mikä erottaa sen kilpailijoista.
        </p>
      </div>
      <div>
        <label className="block mb-1 font-medium" htmlFor="target_audience">
          Kohdeyleisö
        </label>
        <input
          id="target_audience"
          type="text"
          className="w-full border rounded px-2 py-1"
          value={profile.target_audience}
          onChange={handleChange('target_audience')}
        />
        <p className="text-sm text-gray-500">
          Keitä haluat tavoittaa? (esim. ikäryhmä, ammatti, kiinnostuksen kohteet)
        </p>
      </div>
      <div>
        <label className="block mb-1 font-medium" htmlFor="marketing_goals">
          Markkinointitavoitteet
        </label>
        <input
          id="marketing_goals"
          type="text"
          className="w-full border rounded px-2 py-1"
          value={profile.marketing_goals}
          onChange={handleChange('marketing_goals')}
        />
        <p className="text-sm text-gray-500">
          Mitä haluat some‑postauksilla saavuttaa? (bränditunnettuus, myynti, liikenne...)
        </p>
      </div>
      <div>
        <label className="block mb-1 font-medium" htmlFor="tone_of_voice">
          Äänen sävy
        </label>
        <input
          id="tone_of_voice"
          type="text"
          className="w-full border rounded px-2 py-1"
          value={profile.tone_of_voice}
          onChange={handleChange('tone_of_voice')}
        />
        <p className="text-sm text-gray-500">
          Valitse sävy: esimerkiksi asiallinen, rento, huumorintajuinen.
        </p>
      </div>
      <div>
        <label className="block mb-1 font-medium" htmlFor="content_themes">
          Teemat ja avainsanat
        </label>
        <input
          id="content_themes"
          type="text"
          className="w-full border rounded px-2 py-1"
          value={profile.content_themes}
          onChange={handleChange('content_themes')}
        />
        <p className="text-sm text-gray-500">
          Listaa aiheita, kampanjoita tai hashtageja, joita haluat painottaa.
        </p>
      </div>
      <div>
        <label className="block mb-1 font-medium" htmlFor="social_channels">
          Somekanavat (pilkuilla erotettuna)
        </label>
        <input
          id="social_channels"
          type="text"
          className="w-full border rounded px-2 py-1"
          value={profile.social_channels.join(', ')}
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
      <div>
        <label className="block mb-1 font-medium" htmlFor="images">
          Lataa 3–10 kuvaa
        </label>
        <input
          id="images"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImagesChange}
          className="w-full"
        />
        {profile.images.length > 0 && (
          <p className="text-sm text-gray-500 mt-1">
            Valittu {profile.images.length} kuvaa.
          </p>
        )}
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