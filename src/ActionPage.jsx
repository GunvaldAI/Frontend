import React, { useState } from 'react';
import { useAuth } from '@clerk/clerk-react';

/**
 * ActionPage component
 *
 * This component allows the logged in user to generate a series of draft
 * social media posts using the backend AI generation endpoint.  The user
 * can select how many posts to generate (1–10), trigger the generation,
 * and view the resulting posts.  Each generated post is rendered as its
 * own card with controls to accept, reject, edit and generate an image
 * individually.  A global image generation button still exists for
 * convenience if the user wishes to generate images for all posts at once.
 */
const ActionPage = () => {
  const { getToken } = useAuth();
  const [count, setCount] = useState(5);
  const [posts, setPosts] = useState([]);
  // Track number of accepted posts (for potential scheduling)
  const [acceptedCount, setAcceptedCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Note: we keep imageLoading state only for potential future use in
  // global image generation.  At the moment, per-post image generation
  // relies solely on the `imageGenerating` flag within each post.
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(null);
  // Store the user's uploaded profile images.  These images are loaded
  // from the profile API on component mount and can be passed to the
  // image generation endpoint to provide context for the AI (e.g. brand
  // imagery, product photos, etc.).
  const [profileImages, setProfileImages] = useState([]);

  // On mount, fetch the logged-in user's profile to retrieve any
  // uploaded images.  We only need to do this once per page load.
  React.useEffect(() => {
    const fetchProfileImages = async () => {
      try {
        const token = await getToken();
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.gunvald.fi';
        const res = await fetch(`${baseUrl}/api/profiles`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) {
          // If the request fails, silently ignore; profile images are optional.
          return;
        }
        const data = await res.json();
        if (data && Array.isArray(data.images)) {
          setProfileImages(data.images);
        }
      } catch (err) {
        console.error('Failed to load profile images', err);
      }
    };
    fetchProfileImages();
    // We deliberately omit getToken from the dependency array because
    // Clerk returns a stable function and we only need to fetch once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.gunvald.fi';
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
      // Read the response as text so we can handle both raw arrays and
      // stringified JSON with markdown fences (```json ... ```). This is
      // necessary because the AI sometimes returns JSON inside code fences.
      const txt = await res.text();
      let parsed;
      try {
        let cleaned = txt.trim();
        // If the response starts with a code fence, strip it along with any
        // optional "json" language identifier and the closing fence.
        if (cleaned.startsWith('```')) {
          cleaned = cleaned
            .replace(/^```(?:json)?\s*/i, '')
            .replace(/```$/i, '')
            .trim();
        }
        parsed = JSON.parse(cleaned);
      } catch (e) {
        parsed = null;
      }
      // Determine the array of posts from the parsed data.  Accept either
      // an array directly or an object with a `posts` property.
      let postsArray = [];
      if (Array.isArray(parsed)) {
        postsArray = parsed;
      } else if (parsed && Array.isArray(parsed.posts)) {
        postsArray = parsed.posts;
      }
      // Initialize posts with additional metadata for UI interactions
      // We add an `imageGenerating` flag per post so that we can show a
      // loading indicator on the per‑post generate button while an image
      // request is in flight.  Each post starts in a pending state and
      // editing mode disabled.
      const postsWithMeta = postsArray.map((p) => ({
        ...p,
        status: 'pending', // possible values: pending, accepted, rejected
        editing: false,
        imageGenerating: false,
      }));
      setPosts(postsWithMeta);
    } catch (err) {
      console.error('Generate error', err);
      setError(err.message || 'Tuntematon virhe');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Calls the backend /api/generate-images endpoint to generate images
   * for the current list of posts.  It uses each post's imagePrompt if
   * available; otherwise falls back to the first 50 characters of the
   * post text.  The resulting image URLs are stored on the posts in
   * the `imageUrl` property.
   */
  const handleGenerateImages = async () => {
    if (!posts || posts.length === 0) return;
    setImageLoading(true);
    setImageError(null);
    try {
      const prompts = posts.map((p) => p.imagePrompt || p.text.slice(0, 50));
      const token = await getToken();
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.gunvald.fi';
      const res = await fetch(`${baseUrl}/api/generate-images`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        // Include the user's uploaded profile images alongside prompts.  The
        // backend may choose to use these images as reference material when
        // generating new visuals.  If no profileImages are available the
        // property will simply be an empty array.
        body: JSON.stringify({ prompts, images: profileImages }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Failed to generate images');
      }
      const images = await res.json();
      // Attach image URLs to posts
      const updated = [...posts];
      images.forEach((url, idx) => {
        updated[idx].imageUrl = url;
      });
      setPosts(updated);
    } catch (err) {
      console.error('Image generation error', err);
      setImageError(err.message || 'Tuntematon virhe');
    } finally {
      setImageLoading(false);
    }
  };

  /**
   * Generates an image for a single post.  It uses the post's imagePrompt
   * if provided, otherwise falls back to the first 50 characters of the
   * post text.  The generated image URL is stored on that post only.
   *
   * @param {number} idx Index of the post within the posts array
   */
  const handleGenerateImage = async (idx) => {
    if (!posts || idx < 0 || idx >= posts.length) return;
    // Reset any previous image error.  We rely solely on the per‑post
    // loading flag (`imageGenerating`) to signal progress.
    setImageError(null);
    // Mark this specific post as generating so the UI can show a spinner.
    setPosts((prevPosts) => {
      const updated = [...prevPosts];
      if (idx >= 0 && idx < updated.length) {
        updated[idx] = { ...updated[idx], imageGenerating: true };
      }
      return updated;
    });
    try {
      // Compute the prompt using the current state of the post.  Use a copy
      // of posts from the closure to avoid referencing stale state after
      // setPosts calls.
      const currentPost = posts[idx];
      const prompt =
        (currentPost &&
          (currentPost.imagePrompt || currentPost.text?.slice(0, 50))) ||
        '';
      const token = await getToken();
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.gunvald.fi';
      const res = await fetch(`${baseUrl}/api/generate-images`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        // Pass the profileImages array so the AI can utilize user‑uploaded
        // pictures as reference when creating the new image.  We send
        // the prompt as a single-element array to preserve the API
        // contract.
        body: JSON.stringify({ prompts: [prompt], images: profileImages }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Failed to generate image');
      }
      // Expect the response to be a JSON array of URLs.
      let images;
      try {
        images = await res.json();
      } catch (parseErr) {
        // If parsing fails, treat as unknown error.
        throw new Error('Virheellinen kuvaresponssi');
      }
      const url = Array.isArray(images) && images.length > 0 ? images[0] : null;
      // Update the specific post with the new image or clear the loading flag.
      setPosts((prevPosts) => {
        const updated = [...prevPosts];
        if (idx >= 0 && idx < updated.length) {
          updated[idx] = {
            ...updated[idx],
            imageUrl: url || updated[idx].imageUrl,
            imageGenerating: false,
          };
        }
        return updated;
      });
    } catch (err) {
      console.error('Single image generation error', err);
      setImageError(err.message || 'Tuntematon virhe');
      // Ensure we always clear the loading flag even on error.
      setPosts((prevPosts) => {
        const updated = [...prevPosts];
        if (idx >= 0 && idx < updated.length) {
          updated[idx] = { ...updated[idx], imageGenerating: false };
        }
        return updated;
      });
    }
  };

  /**
   * Handles manual image upload for a single post.  Reads the selected
   * file as a base64 data URL and sets it as the post's imageUrl.
   * Also stores the File object on the post as `imageFile` for possible
   * later upload to the server.  Clears any existing error messages.
   *
   * @param {number} idx Index of the post within the posts array
   */
  const handleUploadImageForPost = (idx) => (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      setPosts((prev) => {
        const updated = [...prev];
        if (idx >= 0 && idx < updated.length) {
          updated[idx] = {
            ...updated[idx],
            imageUrl: dataUrl,
            imageFile: file,
            imageGenerating: false,
          };
        }
        return updated;
      });
    };
    reader.onerror = () => {
      setImageError('Kuvan lataaminen epäonnistui');
    };
    reader.readAsDataURL(file);
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
        <div className="mb-4 text-red-600 font-semibold text-center">{error}</div>
      )}
      {posts.length > 0 && (
        <>
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
                    {/* Display an existing image or a placeholder when none is available */}
                    <div className="mt-2">
                      {post.imageUrl ? (
                        <img
                          src={post.imageUrl}
                          alt="Postauksen kuva"
                          className="w-full h-auto rounded"
                        />
                      ) : (
                        <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400 border rounded">
                          Ei kuvaa
                        </div>
                      )}
                    </div>
                    {/* Allow the user to upload a custom image for this post */}
                    <div className="mt-2">
                      <label className="block text-sm text-gray-600">Lataa kuva:</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadImageForPost(idx)}
                      />
                    </div>
                    {/* Action buttons if post is pending */}
                    {post.status === 'pending' && (
                      <div className="flex flex-wrap space-x-2 mt-3">
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
                        <button
                          className="px-3 py-1 bg-purple-500 text-white rounded"
                          onClick={() => handleGenerateImage(idx)}
                          disabled={post.imageGenerating}
                        >
                          {post.imageGenerating
                            ? 'Generoi kuva...'
                            : 'Generoi kuva'}
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
          {/* Display image generation errors */}
          {imageError && (
            <div className="text-red-600 font-semibold text-center mt-4">
              {imageError}
            </div>
          )}
          {/* The global "Generoi kuvat" button has been removed since each
              post has its own image generation control. */}
        </>
      )}
      {posts.length === 0 && !loading && !error && (
        <p className="text-center text-gray-600">Ei vielä generoitua sisältöä.</p>
      )}
    </div>
  );
};

export default ActionPage;