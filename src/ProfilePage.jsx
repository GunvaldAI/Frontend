// Profiilisivu, joka hakee ja tallentaa yrityksen tiedot Clerk-tunnuksen 
// perusteella.
// Tämä versio käyttää uutta /profiles REST-APIa, joka tunnistaa käyttäjän
// Clerk-ID:n avulla ja tallentaa tiedot JSON-sarakkeisiin.  Lomakkeessa
// kysytään yrityksen nimi, kuvaus, kohdeyleisö, äänen sävy, some-kanavat,
// markkinointitavoitteet ja sisällön teemat sekä jopa 30 referenssikuvaa.

import React, { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';

function ProfilePage() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const clerkId = user?.id;

  // Max number of images a user can upload to their profile.
  const MAX_IMAGES = 30;

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
  // Indicate whether a profile already exists for this Clerk user.
  const [hasProfile, setHasProfile] = useState(false);
  const [error, setError] = useState(null);
  // Success message for user feedback after saving profile
  const [successMessage, setSuccessMessage] = useState('');

  // Load profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!clerkId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const token = await getToken();
        const apiBase = import.meta.env.VITE_API_BASE_URL || '';
        const res = await fetch(`${apiBase}/api/profiles/${clerkId}`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        });
        if (res.status === 404) {
          // No existing profile – leave form blank
          setHasProfile(false);
          setLoading(false);
          return;
        }
        if (!res.ok) {
          throw new Error('Failed to fetch profile');
        }
        const data = await res.json();
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
        setHasProfile(true);
        setLoading(false);
      } catch (err) {
        console.warn('Profile not found or error:', err);
        setLoading(false);
      }
    };
    fetchProfile();
  }, [clerkId, getToken]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  // Handle image selection and convert to base64. Allow 0–MAX_IMAGES images.
  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > MAX_IMAGES) {
      setError(`Valitse enintään ${MAX_IMAGES} kuvaa.`);
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
    // Clear previous messages
    setError(null);
    setSuccessMessage('');
    if (!clerkId) {
      setError('Kirjaudu sisään tallentaaksesi profiilin');
      return;
    }
    const saveProfile = async () => {
      try {
        const token = await getToken();
        const apiBase = import.meta.env.VITE_API_BASE_URL || '';
        const body = {
          company_name: profile.company_name,
          description: profile.description,
          target_audience: profile.target_audience,
          tone_of_voice: profile.tone_of_voice,
          social_channels: profile.social_channels,
          marketing_goals: profile.marketing_goals,
          content_themes: profile.content_themes,
          images: profile.images,
        };
        const method = hasProfile ? 'PUT' : 'POST';
        const url = hasProfile
          ? `${apiBase}/api/profiles/${clerkId}`
          : `${apiBase}/api/profiles`;
        const payload = hasProfile ? body : { ...body, clerk_id: clerkId };
        const res = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            Authorization: token ? `Bearer ${token}` : undefined,
          },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          throw new Error('Save failed');
        }
        const data = await res.json();
        setProfile((prev) => ({ ...prev, ...data }));
        setHasProfile(true);
        setSuccessMessage('Tiedot tallennettu onnistuneesti');
      } catch (err) {
        console.error('Failed to save profile:', err);
        setError('Profiilin tallennus epäonnistui');
      }
    };
    saveProfile();
  };

  if (!user) {
    return <p>Kirjaudu sisään tarkastellaksesi profiilia.</p>;
  }
  if (loading) return <p>Ladataan profiilia...</p>;

  return (
    <form onSubmit={handleSave} className="max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">Profiili</h1>
      {error && <p className="text-red-600">{error}</p>}
      {successMessage && <p className="text-green-600">{successMessage}</p>}
      <div>
        <label className="block mb-1 font-medium" htmlFor="company_name">
          Yrityksen nimi
        </label>
        <p className="text-sm text-gray-600 italic mb-1">
          Syötä yrityksesi tai brändisi nimi.
        </p>
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
        <p className="text-sm text-gray-600 italic mb-1">
          Kerro lyhyesti, mitä tarjoat ja mikä tekee sinusta ainutlaatuisen.
        </p>
        <textarea
          id="description"
          className="w-full border rounded px-2 py-1"
          value={profile.description}
          onChange={handleChange('description')}
          rows="3"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium" htmlFor="target_audience">
          Kohdeyleisö
        </label>
        <p className="text-sm text-gray-600 italic mb-1">
          Kuvaile kohdeyleisösi (esim. ikäryhmä, sijainti, kiinnostuksen kohteet).
        </p>
        <input
          id="target_audience"
          type="text"
          className="w-full border rounded px-2 py-1"
          value={profile.target_audience}
          onChange={handleChange('target_audience')}
        />
      </div>
      <div>
        <label className="block mb-1 font-medium" htmlFor="tone_of_voice">
          Äänen sävy
        </label>
        <p className="text-sm text-gray-600 italic mb-1">
          Määrittele brändisi äänensävy (esim. rento, innostava, asiallinen).
        </p>
        <input
          id="tone_of_voice"
          type="text"
          className="w-full border rounded px-2 py-1"
          value={profile.tone_of_voice}
          onChange={handleChange('tone_of_voice')}
        />
      </div>
      <div>
        <label className="block mb-1 font-medium" htmlFor="social_channels">
          Some-kanavat (pilkuin erotettuna)
        </label>
        <p className="text-sm text-gray-600 italic mb-1">
          Luettele sosiaalisen median kanavat, joissa olet aktiivinen, pilkuilla erotettuna.
        </p>
        <input
          id="social_channels"
          type="text"
          className="w-full border rounded px-2 py-1"
          value={profile.social_channels.join(',')}
          onChange={(e) =>
            setProfile((prev) => ({
              ...prev,
              social_channels: e.target.value.split(',').map((s) => s.trim()),
            }))
          }
        />
      </div>
      <div>
        <label className="block mb-1 font-medium" htmlFor="content_themes">
          Sisällön teemat/avainsanat
        </label>
        <p className="text-sm text-gray-600 italic mb-1">
          Kirjoita teemat tai avainsanat, joista haluat postauksia (esim. sahti, käsityöläisolut).
        </p>
        <input
          id="content_themes"
          type="text"
          className="w-full border rounded px-2 py-1"
          value={profile.content_themes}
          onChange={handleChange('content_themes')}
        />
      </div>
      <div>
        <label className="block mb-1 font-medium" htmlFor="marketing_goals">
          Markkinointitavoitteet
        </label>
        <p className="text-sm text-gray-600 italic mb-1">
          Määrittele markkinointisi tavoitteet (esim. brändin tunnettuus, myynnin kasvu).
        </p>
        <input
          id="marketing_goals"
          type="text"
          className="w-full border rounded px-2 py-1"
          value={profile.marketing_goals}
          onChange={handleChange('marketing_goals')}
        />
      </div>
      <div>
        <label className="block mb-1 font-medium" htmlFor="images">
          Lisää 0–{MAX_IMAGES} referenssikuvaa
        </label>
        <p className="text-sm text-gray-600 italic mb-1">
          AI käyttää näitä kuvia visuaalisina referensseinä, kun se generoi uusia kuvia.
        </p>
        <input
          id="images"
          type="file"
          className="w-full"
          multiple
          accept="image/*"
          onChange={handleImagesChange}
        />
        {profile.images && profile.images.length > 0 && (
          <p className="mt-2">{profile.images.length} kuvaa valittu.</p>
        )}
        {/* Display a gallery of existing images */}
        {profile.images && profile.images.length > 0 && (
          <div className="mt-2 flex flex-wrap">
            {profile.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Profiilikuva ${idx + 1}`}
                className="w-24 h-24 object-cover mr-2 mb-2 border"
              />
            ))}
          </div>
        )}
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        Tallenna
      </button>
    </form>
  );
}

export default ProfilePage;