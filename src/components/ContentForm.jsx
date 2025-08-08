import React, { useState } from "react";

const ContentForm = () => {
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [tone, setTone] = useState("");
  const [campaign, setCampaign] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Call backend API with form values
  };

  return (
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
      >
        Generoi sisältö
      </button>
    </form>
  );
};

export default ContentForm;
