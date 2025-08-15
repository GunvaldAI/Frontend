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
  // Track number of accepted posts (for potential scheduling)
  const [acceptedCount, setAcceptedCount] = useState(0);
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
      // Initialize posts with additional metadata for UI interactions
      const postsWithMeta = Array.isArray(data)
        ? data.map((p) => ({
            ...p,
            status: 'pending', // possible values: pending, accepted, rejected
            editing: false,
          }))
        : [];
      setPosts(postsWithMeta);
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
              className={`p-4 border rounded shadow-sm bg-white ${
                post.status === 'accepted' ? 'border-green-400' : ''
              } ${post.status === 'rejected' ? 'opacity-50' : ''}`}
            >
              {/* Post header */}
              <h3 className="font-semibold mb-2">Postaus {idx + 1}</h3>
              {/* Editing mode */}
              {post.editing ? (
                <div className="space-y-2">
                  <textarea
                    className="w-full border p-2 rounded"
                    rows={4}
                    value={post.text}
                    onChange={(e) => {
                      const newPosts = [...posts];
                      newPosts[idx].text = e.target.value;
                      setPosts(newPosts);
                    }}
                  />
                  <input
                    type="text"
                    className="w-full border p-2 rounded"
                    value={post.hashtags ? post.hashtags.join(' ') : ''}
                    onChange={(e) => {
                      const newPosts = [...posts];
                      newPosts[idx].hashtags = e.target.value
                        .split(' ')
                        .filter(Boolean);
                      setPosts(newPosts);
                    }}
                    placeholder="Hashtagit eroteltuna välilyönneillä"
                  />
                  <div className="flex space-x-2">
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded"
                      onClick={() => {
                        const newPosts = [...posts];
                        newPosts[idx].editing = false;
                        setPosts(newPosts);
                      }}
                    >
                      Tallenna
                    </button>
                    <button
                      className="px-4 py-2 bg-gray-400 text-white rounded"
                      onClick={() => {
                        const newPosts = [...posts];
                        newPosts[idx].editing = false;
                        setPosts(newPosts);
                      }}
                    >
                      Peruuta
                    </button>
                  </div>
                </div>
              ) : (
                <>
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
                  {/* Action buttons if post is pending */}
                  {post.status === 'pending' && (
                    <div className="flex space-x-2 mt-3">
                      <button
                        className="px-3 py-1 bg-green-500 text-white rounded"
                        onClick={() => {
                          const newPosts = [...posts];
                          newPosts[idx].status = 'accepted';
                          setPosts(newPosts);
                          setAcceptedCount((c) => c + 1);
                        }}
                      >
                        Hyväksy
                      </button>
                      <button
                        className="px-3 py-1 bg-yellow-500 text-white rounded"
                        onClick={() => {
                          const newPosts = [...posts];
                          newPosts[idx].editing = true;
                          setPosts(newPosts);
                        }}
                      >
                        Muokkaa
                      </button>
                      <button
                        className="px-3 py-1 bg-red-500 text-white rounded"
                        onClick={() => {
                          const newPosts = [...posts];
                          newPosts[idx].status = 'rejected';
                          setPosts(newPosts);
                        }}
                      >
                        Hylkää
                      </button>
                    </div>
                  )}
                  {post.status === 'accepted' && (
                    <p className="mt-2 text-green-600 font-semibold">
                      Hyväksytty
                    </p>
                  )}
                  {post.status === 'rejected' && (
                    <p className="mt-2 text-red-600 font-semibold">
                      Hylätty
                    </p>
                  )}
                </>
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