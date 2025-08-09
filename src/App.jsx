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
      // data may be an array (if backend returns posts directly) or an object containing posts/content
      const postsArray = Array.isArray(data)
        ? data
        : data.posts || data.content || [];
      setPosts(postsArray);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex flex-col items-center p-6">
      <header className="text-center my-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">Gunvald</h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-lg">
          Automaattinen sisällöntuottaja PK-yrityksille – generoi ja julkaise somesisältö
          vaivattomasti.
        </p>
      </header>
      <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-xl p-8 w-full max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-700">Yrityksen nimi</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="border rounded w-full p-3 focus:ring-2 focus:ring-purple-400"
              placeholder="Esim. Kahvila Oy"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Toimiala</label>
            <input
              type="text"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="border rounded w-full p-3 focus:ring-2 focus:ring-purple-400"
              placeholder="Esim. Ravintola"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Brändin sävy</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="border rounded w-full p-3 focus:ring-2 focus:ring-purple-400"
              required
            >
              <option value="">Valitse sävy</option>
              <option value="Rent">Rent</option>
              <option value="Virallinen">Virallinen</option>
              <option value="Hauska">Hauska</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium text-gray-700">Kampanjateema</label>
            <input
              type="text"
              value={campaign}
              onChange={(e) => setCampaign(e.target.value)}
              className="border rounded w-full p-3 focus:ring-2 focus:ring-purple-400"
              placeholder="Esim. Syyskampanja"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 mt-2 rounded bg-purple-600 hover:bg-purple-700 text-white font-semibold transition"
            disabled={loading}
          >
            {loading ? "Generoi..." : "Generoi sisältö"}
          </button>
        </form>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>
      {posts && posts.length > 0 && (
        <div className="mt-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post, index) => (
            <div key={index} className="bg-white/90 backdrop-blur-lg p-6 rounded-xl shadow-md flex flex-col">
              {post.date && <span className="text-sm text-gray-500 mb-2">{post.date}</span>}
              {post.text && <p className="text-gray-700 font-medium">{post.text}</p>}
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt="Generoitu kuva"
                  className="mt-3 rounded-md object-cover w-full h-48"
                />
              )}
              {post.hashtags && (
                <p className="mt-3 text-sm text-gray-500">
                  {Array.isArray(post.hashtags) ? post.hashtags.join(" ") : post.hashtags}
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
