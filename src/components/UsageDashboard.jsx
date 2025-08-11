import React from 'react';

// Dashboard for displaying usage statistics.
// Fetches usage data from the backend and displays tokens and images used.
export default function UsageDashboard() {
  const [usage, setUsage] = React.useState(null);
  const [postStats, setPostStats] = React.useState([]);
  const [statusStats, setStatusStats] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    async function fetchAll() {
      try {
        const token = localStorage.getItem('token');
        const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
        // Fetch usage metrics
        const usageRes = await fetch('/api/usage', { headers: authHeaders });
        if (!usageRes.ok) throw new Error('Failed to fetch usage');
        const usageData = await usageRes.json();
        setUsage(usageData);
        // Fetch weekly post statistics
        const postsRes = await fetch('/api/stats/posts', { headers: authHeaders });
        if (postsRes.ok) {
          const postsData = await postsRes.json();
          setPostStats(postsData);
        }
        // Fetch status counts
        const statusRes = await fetch('/api/stats/status', { headers: authHeaders });
        if (statusRes.ok) {
          const statusData = await statusRes.json();
          setStatusStats(statusData);
        }
      } catch (err) {
        setError(err.message || 'Virhe haettaessa tilastoja');
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-2xl font-bold">Käyttöraportit</h2>
      {loading && <p>Ladataan tilastoja...</p>}
      {error && <p className="text-red-600">Virhe: {error}</p>}
      {!loading && !error && (
        <>
          {/* Usage metrics */}
          {usage && (
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
          {/* Status statistics */}
          {statusStats && (
            <div className="space-y-2">
              <h3 className="text-xl font-semibold mt-6">Julkaisujen tila</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 border rounded-lg shadow-sm">
                  <p className="font-semibold text-sm text-gray-600">Luonnoksia</p>
                  <p className="text-2xl font-bold">{statusStats.draft || 0}</p>
                </div>
                <div className="p-4 border rounded-lg shadow-sm">
                  <p className="font-semibold text-sm text-gray-600">Ajastettuja</p>
                  <p className="text-2xl font-bold">{statusStats.scheduled || 0}</p>
                </div>
                <div className="p-4 border rounded-lg shadow-sm">
                  <p className="font-semibold text-sm text-gray-600">Julkaistuja</p>
                  <p className="text-2xl font-bold">{statusStats.published || 0}</p>
                </div>
              </div>
            </div>
          )}
          {/* Weekly post statistics */}
          {postStats && postStats.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xl font-semibold mt-6">Postaukset viikoittain</h3>
              <ul className="list-disc list-inside space-y-1">
                {postStats.map((row) => (
                  <li key={row.week_start} className="flex justify-between">
                    <span>{row.week_start}</span>
                    <span className="font-semibold">{row.post_count}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
