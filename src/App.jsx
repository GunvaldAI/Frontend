import React, { useState } from "react";

function App() {
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [tone, setTone] = useState("");
  const [campaign, setCampaign] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
      
    setContent("");
    try {
        
      const response = await fetch("/api/generate", {
          
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, industry, tone, campaign }),
      });
      if (!response.ok) {
        throw new Error("Failed to generate content");
      }
      const data = await response.json();
      setContent(data.content || "");
    } catch (err) {
      setError(err.message || "Error generating content");
    } finally {
      setLoading(false);
    }
 
  ;

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
            <option value="rent">Rent</option>
            <option value="virallinen">Virallinen</option>
            <option value="hauska">Hauska</option>
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

          className="bg-blue-600 text-white rounded w-full p-2 mt-2"
          disabled={loading}
        >
          {loading ? "Generoi..." : "Generoi sisältö"}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {content && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <pre className="whitespace-pre-wrap">{content}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
