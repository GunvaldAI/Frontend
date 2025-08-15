import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';

/**
 * ActionPage component
 *
 * This component allows the logged in user to generate a series of draft
 * social media posts using the backend AI generation endpoint.  The user
 * can select how many posts to generate (1–10), trigger the generation,
 * and view the resulting posts.  Each generated post includes text,
 * hashtags and an optional image prompt returned by the API.
 */
const ActionPage = () => {
  const { getToken } = useAuth();
  const [count, setCount] = useState(5);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Calls the backend /api/generate endpoint to create a list of posts.
   * The request includes the desired post count and the user's auth token.
   */
  const handleGenerate = async () => {
    // Clamp the requested count between 1 and 10
    const num = Math.max(1, Math.min(10, Number(count) || 5));
    setLoading(true);
    setError(null);
    try {
      const token = await getToken();
      // Construct the base URL from an environment variable when available.
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(`${baseUrl}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ count: num }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Failed to generate posts');
      }
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Generate error', err);
      setError(err.message || 'Tuntematon virhe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 text-gray-700">
      <h2 className="text-3xl font-bold mb-4 text-center">Generoi postauksia</h2>
      <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4 mb-8">
        <label className="flex items-center space-x-2">
          <span className="font-medium">Postausten määrä:</span>
          <input
            type="number"
            min="1"
            max="10"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            className="w-20 px-2 py-1 border rounded"
          />
        </label>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`px-6 py-2 rounded text-white bg-indigo-600 hover:bg-indigo-700 transition ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Generoi...' : 'Generoi postaukset'}
        </button>
      </div>
      {error && (
        <div className="mb-4 text-red-600 font-semibold text-center">
          {error}
        </div>
      )}
      {posts.length > 0 && (
        <div className="space-y-6">
          {posts.map((post, idx) => (
            <div
              key={idx}
              className="p-4 border rounded shadow-sm bg-white"
            >
              <h3 className="font-semibold mb-2">Postaus {idx + 1}</h3>
              <p className="mb-2 whitespace-pre-line">{post.text}</p>
              {post.hashtags && post.hashtags.length > 0 && (
                <p className="mb-2 text-sm text-gray-600">
                  Hashtagit: {post.hashtags.join(' ')}
                </p>
              )}
              {post.imagePrompt && (
                <p className="text-sm text-gray-600">
                  Kuvaprompti: {post.imagePrompt}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
      {posts.length === 0 && !loading && !error && (
        <p className="text-center text-gray-600">Ei vielä generoitua sisältöä.</p>
      )}
    </div>
  );
};

export default ActionPage;