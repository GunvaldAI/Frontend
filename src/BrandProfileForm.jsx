import React, { useEffect, useState } from 'react';

/**
 * BrandProfileForm component
 *
 * This React component displays a form for editing an organization's brand
 * settings: company name, industry, target audience, tone, brand colors and
 * logo URL. It interacts with the backend via `/api/brand-profile` to fetch
 * the current profile and to save updates. The component expects a valid
 * JWT stored in localStorage under the key 'token'.
 */
function BrandProfileForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState({
    company_name: '',
    industry: '',
    target_audience: '',
    tone: '',
    brand_colors: '',
    logo_url: '',
  });

  // Fetch existing brand profile on mount
  useEffect(() => {
    async function fetchProfile() {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        setLoading(true);
        const API_BASE_URL = import.meta.env && import.meta.env.VITE_API_BASE_URL
          ? import.meta.env.VITE_API_BASE_URL
          : '';
        const res = await fetch(`${API_BASE_URL}/api/brand-profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch brand profile');
        const data = await res.json();
        if (data) {
          setProfile({
            company_name: data.company_name || '',
            industry: data.industry || '',
            target_audience: data.target_audience || '',
            tone: data.tone || '',
            brand_colors: data.brand_colors || '',
            logo_url: data.logo_url || '',
          });
        }
      } catch (e) {
        console.error(e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  // Handle input changes
  function handleChange(e) {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  }

  // Submit profile
  async function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to save your brand profile');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const API_BASE_URL = import.meta.env && import.meta.env.VITE_API_BASE_URL
        ? import.meta.env.VITE_API_BASE_URL
        : '';
      const res = await fetch(`${API_BASE_URL}/api/brand-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });
      if (!res.ok) throw new Error('Failed to save brand profile');
      const saved = await res.json();
      setProfile(saved);
      alert('Brand profile saved');
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Brändiasetukset</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1" htmlFor="company_name">
            Yrityksen nimi
          </label>
          <input
            id="company_name"
            name="company_name"
            type="text"
            value={profile.company_name}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1" htmlFor="industry">
            Toimiala
          </label>
          <input
            id="industry"
            name="industry"
            type="text"
            value={profile.industry}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1" htmlFor="target_audience">
            Kohderyhmät
          </label>
          <input
            id="target_audience"
            name="target_audience"
            type="text"
            value={profile.target_audience}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1" htmlFor="tone">
            Äänen sävy
          </label>
          <input
            id="tone"
            name="tone"
            type="text"
            value={profile.tone}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1" htmlFor="brand_colors">
            Brändivärit (esim. #RRGGBB, pilkulla erotettuna)
          </label>
          <input
            id="brand_colors"
            name="brand_colors"
            type="text"
            value={profile.brand_colors}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1" htmlFor="logo_url">
            Logon URL
          </label>
          <input
            id="logo_url"
            name="logo_url"
            type="text"
            value={profile.logo_url}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </div>
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Tallennetaan…' : 'Tallenna'}
        </button>
      </form>
    </div>
  );
}

export default BrandProfileForm;