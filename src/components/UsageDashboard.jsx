import React from 'react';

// Dashboard for displaying usage statistics.
// Fetches usage data from the backend and displays tokens and images used.
export default function UsageDashboard() {
  const [usage, setUsage] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    async function fetchUsage() {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/usage', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (!res.ok) {
          throw new Error('Failed to fetch usage');
        }
        const data = await res.json();
        setUsage(data);
      } catch (err) {
        setError(err.message || 'Error fetching usage');
      } finally {
        setLoading(false);
      }
    }
    fetchUsage();
  }, []);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold">Käyttöraportit</h2>
      {loading && <p>Ladataan käyttötilastoja...</p>}
      {error && <p className="text-red-600">Virhe: {error}</p>}
      {!loading && !error && usage && (
        <div className="space-y-2">
          <div className="flex items-center space-x-4">
            <span className="font-semibold">Tokenien käyttö:</span>
            <span>{usage.tokens_used}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="font-semibold">Generoitujen kuvien määrä:</span>
            <span>{usage.images_generated}</span>
          </div>
          {!usage.tokens_used && !usage.images_generated && (
            <p className="text-gray-600">Ei vielä käyttödataa tälle kuukaudelle.</p>
          )}
        </div>
      )}
      <div className="mt-6">
        <h3 className="text-xl font-semibold">Tulevat tilastot</h3>
        <ul className="list-disc list-inside space-y-2 mt-2">
          <li>Julkaistujen ja ajastettujen postausten määrä per viikko.</li>
          <li>Top‑postaukset aiheen ja hashtagin mukaan.</li>
          <li>Suunnitelmien tehokkuus ja käyttötaso organisaatiokohtaisesti.</li>
        </ul>
      </div>
    </div>
  );
}
