// Tämä tiedosto määrittelee Gunvaldin uuden profiilisivun.
// Se noudattaa Readdy‑esimerkin ulkoasua ja kysymysrakennetta mutta säilyttää
// Gunvaldin aiemmat profiilikentät, jotta AI‑avusteinen julkaisujen
// generointi toimii edelleen. Kentät, jotka eivät ole API:n tarvitsemia,
// tallennetaan paikalliseen tilaan mutta jätetään lähettämättä palvelimelle.
//
// Pääkomponentti sisältää useita osioita: edistymispalkki, hyötyjä kuvaava
// banneri, kuvagalleria sekä lomakeosat yritystiedoille, brändin äänelle,
// kohdeyleisölle ja kanaville sekä sisällöntuotannon tavoitteille. Kentät
// kartoituvat vanhoihin profiilikenttiin seuraavasti:
//  - businessName -> company_name
//  - businessDescription -> description
//  - targetAudience -> target_audience
//  - brandVoice -> tone_of_voice
//  - preferredPlatforms -> social_channels
//  - contentGoals -> marketing_goals
//  - keyTopics -> content_themes

import React, { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';

function ProfilePage() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const clerkId = user?.id;

  // Määritellään profiilin tilakentät. Vanhoja kenttiä käytetään AI:n ohjaukseen,
  // uusia kenttiä käytetään vain käyttöliittymässä eikä niitä lähetetä API:lle.
  const [profile, setProfile] = useState({
    company_name: '',
    description: '',
    target_audience: '',
    tone_of_voice: '',
    social_channels: [],
    marketing_goals: '',
    content_themes: '',
    images: [],
    // Lisäkentät Readdy‑mallista
    industry: '',
    company_size: '',
    location: '',
    website: '',
    brand_voice: '',
    key_messages: '',
    posting_frequency: '',
    preferred_platforms: [],
    business_description: '',
    content_goals: '',
    key_topics: '',
    competitors_to_avoid: '',
    brand_personality: '',
    content_style: '',
    call_to_action: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [hasProfile, setHasProfile] = useState(false);
  const MAX_IMAGES = 30;

  // Lataa olemassa oleva profiili palvelimelta. Täyttää sekä
  // vanhat että uudet kentät jos dataa löytyy. Jos dataa ei ole,
  // lomake alustetaan tyhjillä arvoilla.
  useEffect(() => {
    async function fetchProfile() {
      if (!clerkId) return;
      setLoading(true);
      try {
        const token = await getToken();
        const res = await fetch(`/api/profiles/${clerkId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setHasProfile(true);
            setProfile((prev) => ({
              ...prev,
              company_name: data.company_name || '',
              description: data.description || '',
              target_audience: data.target_audience || '',
              tone_of_voice: data.tone_of_voice || '',
              social_channels: data.social_channels || [],
              marketing_goals: data.marketing_goals || '',
              content_themes: data.content_themes || '',
              images: data.images || [],
              // Peilataan joitakin kenttiä käyttäjälle näkyviin
              business_description: data.description || '',
              content_goals: data.marketing_goals || '',
              key_topics: data.content_themes || '',
            }));
          }
        }
      } catch (err) {
        console.error(err);
        setError('Profiilin lataaminen epäonnistui.');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [clerkId, getToken]);

  // Laske edistymisprosentti täytettyjen kenttien perusteella.
  const progress = (() => {
    const requiredFields = [
      profile.company_name,
      profile.description,
      profile.target_audience,
      profile.tone_of_voice,
      profile.social_channels && profile.social_channels.length > 0 ? 'ok' : '',
      profile.marketing_goals,
      profile.content_themes,
    ];
    const filled = requiredFields.filter((v) => v && v !== '').length;
    return Math.round((filled / requiredFields.length) * 100);
  })();

  // Yleinen muutoskäsittelijä tekstikentille.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Käsittelijä taulukkokentille, kuten social_channels ja preferred_platforms.
  const handleArrayChange = (name, value) => {
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Kuvatiedostojen käsittely. Tämä yksinkertainen versio lähettää
  // tiedoston serverin kautta Cloudinaryyn. Säilytetään vanhat kuvat.
  const handleImagesChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const token = await getToken();
    const newImages = [];
    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        const response = await fetch('/api/upload-image', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        if (response.ok) {
          const { url } = await response.json();
          newImages.push(url);
        } else {
          console.error('Kuvan lataus epäonnistui');
        }
      } catch (err) {
        console.error(err);
      }
    }
    setProfile((prev) => ({ ...prev, images: [...prev.images, ...newImages] }));
  };

  // Kuvan poistaminen listasta.
  const handleDeleteImage = (url) => {
    setProfile((prev) => ({ ...prev, images: prev.images.filter((img) => img !== url) }));
  };

  // Tallenna profiili. Lähetetään vain vanhat kentät API:lle, jotta AI toimii
  // entiseen tapaan. Jos profiilia ei ole olemassa, tehdään POST, muuten PUT.
  const handleSave = async () => {
    setError(null);
    setSuccessMessage('');
    try {
      const token = await getToken();
      const body = {
        company_name: profile.company_name,
        description: profile.description,
        target_audience: profile.target_audience,
        tone_of_voice: profile.tone_of_voice,
        social_channels: profile.preferred_platforms.length
          ? profile.preferred_platforms
          : profile.social_channels,
        marketing_goals: profile.content_goals || profile.marketing_goals,
        content_themes: profile.key_topics || profile.content_themes,
        images: profile.images,
      };
      const method = hasProfile ? 'PUT' : 'POST';
      const endpoint = hasProfile ? `/api/profiles/${clerkId}` : '/api/profiles';
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        throw new Error('Tallennus epäonnistui');
      }
      setHasProfile(true);
      setSuccessMessage('Profiili tallennettu!');
    } catch (err) {
      console.error(err);
      setError('Profiilin tallennus epäonnistui.');
    }
  };

  // Asetukset valituille alustoille (ensisijaiset kanavat). Tarjotaan muutama yleinen vaihtoehto.
  const platformOptions = [
    'Instagram',
    'TikTok',
    'LinkedIn',
    'Facebook',
    'Twitter',
    'YouTube',
  ];

  // Tarjotaan vaihtoehtoja toimialalle ja yrityksen koolle.
  const industryOptions = ['Teknologia', 'Markkinointi', 'Koulutus', 'Hyvinvointi', 'Muu'];
  const sizeOptions = ['1-10', '11-50', '51-200', '201-500', '500+'];
  const frequencyOptions = ['Päivittäin', 'Useammin viikossa', 'Viikoittain', 'Harvemmin'];

  if (loading) {
    return <div className="p-8 text-white">Ladataan...</div>;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-12 text-white max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Profiili</h1>
      {/* Edistymispalkki */}
      <div className="mb-6">
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="mt-2 text-sm text-gray-300">{progress}% täytetty</p>
      </div>
      {/* Hyötybanneri */}
      <div className="mb-8 bg-gray-800 rounded-lg p-4 flex flex-wrap gap-4 justify-between items-center text-sm">
        <div className="flex items-center gap-2">
          <i className="ri-flashlight-line text-purple-400"></i>
          <span>AI nopeuttaa sisällöntuotantoa</span>
        </div>
        <div className="flex items-center gap-2">
          <i className="ri-time-line text-blue-400"></i>
          <span>Älykäs ajastus säästää aikaa</span>
        </div>
        <div className="flex items-center gap-2">
          <i className="ri-bar-chart-line text-green-400"></i>
          <span>Analytiikka parantaa suorituskykyä</span>
        </div>
      </div>
      {/* Kuvagalleria */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Kuvagalleria</h2>
        <p className="text-sm text-gray-400 mb-4">
          Lataa kuvia yrityksestäsi. Näitä kuvia käytetään AI:n luomassa sisällössä.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
          {profile.images.map((img, idx) => (
            <div key={idx} className="relative group">
              <img src={img} alt="Kuva" className="w-full h-32 object-cover rounded-md" />
              <button
                type="button"
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                onClick={() => handleDeleteImage(img)}
              >
                <i className="ri-close-line"></i>
              </button>
            </div>
          ))}
          {/* Lisäysnappi */}
          {profile.images.length < MAX_IMAGES && (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-md h-32 cursor-pointer hover:border-purple-500">
              <i className="ri-upload-cloud-line text-2xl mb-2"></i>
              <span className="text-xs">Lisää kuvia</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImagesChange}
              />
            </label>
          )}
        </div>
        <p className="text-xs text-gray-500">
          {profile.images.length}/{MAX_IMAGES} kuvaa ladattu
        </p>
      </section>
      {/* Yrityksen tiedot */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Yrityksen tiedot</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm mb-1">Yrityksen nimi</label>
            <input
              type="text"
              name="company_name"
              value={profile.company_name}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Toimiala</label>
            <select
              name="industry"
              value={profile.industry}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
            >
              <option value="">Valitse toimiala</option>
              {industryOptions.map((opt) => (
                <option key={opt} value={opt} className="text-black">
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Yrityksen koko</label>
            <select
              name="company_size"
              value={profile.company_size}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
            >
              <option value="">Valitse koko</option>
              {sizeOptions.map((opt) => (
                <option key={opt} value={opt} className="text-black">
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm mb-1">Sijainti</label>
            <input
              type="text"
              name="location"
              value={profile.location}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Verkkosivut</label>
            <input
              type="text"
              name="website"
              value={profile.website}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
            />
          </div>
        </div>
      </section>
      {/* Brändin ääni ja viestit */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Brändin ääni ja viestit</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Yrityksen kuvaus ja ydinviesti</label>
            <textarea
              name="description"
              value={profile.description}
              onChange={handleChange}
              rows={4}
              className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm mb-1">Äänensävy / Brändin ääni</label>
            <textarea
              name="tone_of_voice"
              value={profile.tone_of_voice}
              onChange={handleChange}
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm mb-1">Avainviestit</label>
            <textarea
              name="key_messages"
              value={profile.key_messages}
              onChange={handleChange}
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
            ></textarea>
          </div>
        </div>
      </section>
      {/* Kohdeyleisö ja kanavat */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Kohdeyleisö ja kanavat</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Kohdeyleisö</label>
            <textarea
              name="target_audience"
              value={profile.target_audience}
              onChange={handleChange}
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm mb-1">Ensisijaiset kanavat</label>
            <div className="flex flex-wrap gap-2">
              {platformOptions.map((opt) => {
                const selected = profile.preferred_platforms.includes(opt);
                return (
                  <button
                    type="button"
                    key={opt}
                    onClick={() => {
                      let newPlatforms;
                      if (selected) {
                        newPlatforms = profile.preferred_platforms.filter((p) => p !== opt);
                      } else {
                        newPlatforms = [...profile.preferred_platforms, opt];
                      }
                      handleArrayChange('preferred_platforms', newPlatforms);
                    }}
                    className={`px-3 py-1 rounded-full border text-sm transition ${
                      selected
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label className="block text-sm mb-1">Julkaisutiheys</label>
            <select
              name="posting_frequency"
              value={profile.posting_frequency}
              onChange={handleChange}
              className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
            >
              <option value="">Valitse</option>
              {frequencyOptions.map((opt) => (
                <option key={opt} value={opt} className="text-black">
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>
      {/* Tavoitteet ja aiheet */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Tavoitteet ja avainteemat</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm mb-1">Sisällöntuotannon tavoitteet</label>
            <textarea
              name="content_goals"
              value={profile.content_goals}
              onChange={handleChange}
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm mb-1">Avainteemat ja aiheet</label>
            <textarea
              name="key_topics"
              value={profile.key_topics}
              onChange={handleChange}
              rows={3}
              className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
            ></textarea>
          </div>
        </div>
      </section>
      {/* Tallennuspainike ja viestit */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleSave}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md font-medium"
        >
          Tallenna profiili
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
      </div>
    </div>
  );
}

export default ProfilePage;