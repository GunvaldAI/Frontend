import React, { useState } from "react";

function App() {
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [tone, setTone] = useState("");
  const [campaign, setCampaign] = useState("");
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPosts(null);
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
      const response = await fetch(`${API_BASE_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, industry, tone, campaign }),
      });
      if (!response.ok) {
        throw new Error("Failed to generate content");
      }
      const data = await response.json();
      // Support both array and object responses
      const postsArray = Array.isArray(data) ? data : data.posts || [];
      setPosts(postsArray);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
        <div>
          <label className="block mb-1 font-medium">Yrityksen nimi</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="border rounded w-full p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Toimiala</label>
          <input
            type="text"
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="border rounded w-full p-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Brändin sävy</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="border rounded w-full p-2"
            required
          >
            <option value="">Valitse sävy</option>
            <option value="Rent">Rent</option>
            <option value="Virallinen">Virallinen</option>
            <option value="Hauska">Hauska</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">Kampanjateema</label>
          <input
            type="text"
            value={campaign}
            onChange={(e) => setCampaign(e.target.value)}
            className="border rounded w-full p-2"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white rounded w-full p-2 mt-2"
          disabled={loading}
        >
          {loading ? "Generoi..." : "Generoi sisältö"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      {posts && (
        <div className="mt-8 space-y-6 max-w-md mx-auto">
          {posts.map((post, index) => (
            <div
              key={index}
              className="border bg-gray-100 p-4 rounded shadow-sm"
            >
              {post.date && (
                <h3 className="font-semibold mb-2">{post.date}</h3>
              )}
              {post.text && <p>{post.text}</p>}
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt="Generated visual"
                  className="mt-2 rounded"
                />
              )}
              {post.hashtags && (
                <p className="mt-2 text-sm text-gray-600">
                  {Array.isArray(post.hashtags)
                    ? post.hashtags.join(" ")
                    : post.hashtags}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
