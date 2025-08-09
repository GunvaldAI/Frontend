import React, { useEffect, useState } from 'react';

/**
 * ProfilePage component
 *
 * This component renders a form for users to fill in their company profile.
 * It uses the API endpoints created on the backend to fetch existing profile
 * information and to submit updates. It also supports uploading up to 10
 * images via a separate API call. A JWT token should be stored in local
 * storage after login/registration; the token is included in the `Authorization`
 * header for authenticated requests.
 */
function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    company_description: '',
    content_preferences: '',
    team_info: '',
    target_audience: '',
  });
  const [images, setImages] = useState([]);

  // Fetch existing profile on mount
  useEffect(() => {
    async function fetchProfile() {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        setLoading(true);
        const res = await fetch('/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        if (data) {
          setForm({
            company_description: data.company_description || '',
            content_preferences: data.content_preferences || '',
            team_info: data.team_info || '',
            target_audience: data.target_audience || '',
          });
        }
      } catch (e) {
        console.error(e);
        setError('Could not load profile');
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  // Handle text input changes
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // Handle image selection
  function handleFileChange(e) {
    setImages(Array.from(e.target.files));
  }

  // Submit profile form
  async function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to save your profile');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      // Save textual profile data
      const res = await fetch('/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to save profile');

      // Upload images if any
      if (images.length) {
        const profileData = await res.json();
        const formData = new FormData();
        formData.append('profileId', profileData.id);
        images.forEach((file) => formData.append('images', file));
        const imgRes = await fetch('/profile/images', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        if (!imgRes.ok) throw new Error('Failed to upload images');
      }
      alert('Profile saved successfully!');
    } catch (e) {
      console.error(e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Täydennä profiili</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1" htmlFor="company_description">
            Kuvaile yritystäsi
          </label>
          <textarea
            id="company_description"
            name="company_description"
            value={form.company_description}
            onChange={handleChange}
            rows={4}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1" htmlFor="content_preferences">
            Minkälaista somesisältöä haluat luoda?
          </label>
          <textarea
            id="content_preferences"
            name="content_preferences"
            value={form.content_preferences}
            onChange={handleChange}
            rows={3}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1" htmlFor="team_info">
            Kerro teistä/tiimistäsi
          </label>
          <textarea
            id="team_info"
            name="team_info"
            value={form.team_info}
            onChange={handleChange}
            rows={3}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1" htmlFor="target_audience">
            Minkälainen on ihannekohdeyleisösi?
          </label>
          <textarea
            id="target_audience"
            name="target_audience"
            value={form.target_audience}
            onChange={handleChange}
            rows={3}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1" htmlFor="images">
            Lisää 3–10 kuvaa yrityksestäsi (logo, toimitilat, tiimi jne.)
          </label>
          <input
            type="file"
            id="images"
            name="images"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            className="w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Tallenna profiili'}
        </button>
      </form>
    </div>
  );
}

export default ProfilePage;
