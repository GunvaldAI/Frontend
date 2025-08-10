import React, { useEffect, useState } from 'react';

/**
 * ContentCalendar component
 *
 * This component renders a simple content calendar view for scheduled posts.
 * It fetches posts from the API and groups them by their scheduled date. Users can
 * update the publish date/time using a datetime-local input, which calls the
 * `/api/schedule` endpoint. This is a simplified calendar intended for MVP;
 * a full drag-and-drop calendar could replace this later.
 */
function ContentCalendar() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  // Fetch posts on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    async function loadPosts() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/posts`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to load posts');
        const data = await res.json();
        setPosts(data);
      } catch (e) {
        console.error(e);
        setError('Virhe ladattaessa postauksia');
      }
    }
    loadPosts();
  }, []);

  // Update a post's publish date/time
  async function handleScheduleChange(postId, newDate) {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Kirjaudu sisään muokataksesi ajastuksia');
      return;
    }
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/schedule`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ postId, publishAt: newDate }),
      });
      if (!res.ok) throw new Error('Failed to schedule post');
      // Update local state with new publishAt
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, publishAt: newDate } : p))
      );
    } catch (e) {
      console.error(e);
      setError('Ajastuksen tallentaminen epäonnistui');
    }
  }

  // Group posts by date string for display
  const groupedPosts = posts.reduce((acc, post) => {
    const dateKey = post.publishAt
      ? new Date(post.publishAt).toDateString()
      : 'Ei ajastusta';
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(post);
    return acc;
  }, {});

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sisältökalenteri</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {Object.keys(groupedPosts).length === 0 && (
        <p>Ei luonnoksia tai ajastettuja postauksia.</p>
      )}
      {Object.keys(groupedPosts).map((date) => (
        <div key={date} className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{date}</h2>
          <ul className="space-y-2">
            {groupedPosts[date].map((post) => (
              <li key={post.id} className="border rounded p-3">
                <p className="font-medium mb-1">{post.content}</p>
                {post.hashtags && post.hashtags.length > 0 && (
                  <p className="text-sm text-gray-600 mb-2">
                    Hashtagit: {post.hashtags.join(', ')}
                  </p>
                )}
                <div>
                  <label className="text-sm font-medium">
                    Julkaisuajankohta:
                    <input
                      type="datetime-local"
                      value={
                        post.publishAt
                          ? new Date(post.publishAt)
                              .toISOString()
                              .slice(0, 16)
                          : ''
                      }
                      onChange={(e) => handleScheduleChange(post.id, e.target.value)}
                      className="ml-2 border rounded p-1"
                    />
                  </label>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default ContentCalendar;