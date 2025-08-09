import React, { useState } from 'react';
import ProfilePage from './components/ ProfilePage.jsx';
// Separate component definitions outside of App to preserve focus during re-renders.

const Home = ({ setView }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center p-4">
    <div className="text-center text-white space-y-6">
      <h1 className="text-5xl md:text-7xl font-extrabold">Gunvald</h1>
      <p className="text-xl md:text-2xl max-w-xl mx-auto">
        Tekoälyavusteinen sosiaalisen median assistentti. Luo ja hallinnoi sisältöä
        nopeasti.
      </p>
      <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6">
        <button
          onClick={() => setView('login')}
          className="bg-white text-gray-800 font-semibold py-3 px-8 rounded-full shadow hover:bg-gray-200 transition"
        >
          Kirjaudu sisään
        </button>
        <button
          onClick={() => setView('register')}
          className="bg-white text-gray-800 font-semibold py-3 px-8 rounded-full shadow hover:bg-gray-200 transition"
        >
          Rekisteröidy
        </button>
      </div>
    </div>
  </div>
);

const Register = ({ registerInfo, handleChange, handleSubmit, setView }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Rekisteröidy</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Yrityksen nimi</label>
          <input
            type="text"
            name="companyName"
            value={registerInfo.companyName}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Toimiala</label>
          <input
            type="text"
            name="industry"
            value={registerInfo.industry}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Sähköposti</label>
          <input
            type="email"
            name="email"
            value={registerInfo.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Salasana</label>
          <input
            type="password"
            name="password"
            value={registerInfo.password}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded hover:bg-blue-700 transition"
        >
          Rekisteröidy
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        Onko sinulla jo tili?{' '}
        <button onClick={() => setView('login')} className="text-blue-600 hover:underline">
          Kirjaudu sisään
        </button>
      </p>
      <button
        onClick={() => setView('home')}
        className="mt-6 text-sm text-blue-600 hover:underline"
      >
        Palaa etusivulle
      </button>
    </div>
  </div>
);

const Login = ({ loginInfo, handleChange, handleSubmit, setView }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Kirjaudu sisään</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Sähköposti</label>
          <input
            type="email"
            name="email"
            value={loginInfo.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Salasana</label>
          <input
            type="password"
            name="password"
            value={loginInfo.password}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded hover:bg-blue-700 transition"
        >
          Kirjaudu
        </button>
      </form>
      <p className="mt-4 text-sm text-gray-600">
        Ei tiliä vielä?{' '}
        <button onClick={() => setView('register')} className="text-blue-600 hover:underline">
          Rekisteröidy
        </button>
      </p>
      <button
        onClick={() => setView('home')}
        className="mt-6 text-sm text-blue-600 hover:underline"
      >
        Palaa etusivulle
      </button>
    </div>
  </div>
);

const Generate = ({
  generateInfo,
  handleChange,
  handleSubmit,
  posts,
  loading,
  error,
  setView,
}) => (
  <div className="min-h-screen bg-gray-50 p-6">
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Generoi sisältöä</h2>
        <button onClick={() => setView('home')} className="text-blue-600 hover:underline">
          Takaisin etusivulle
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-gray-700 mb-1">Yrityksen nimi</label>
          <input
            type="text"
            name="companyName"
            value={generateInfo.companyName}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Toimiala</label>
          <input
            type="text"
            name="industry"
            value={generateInfo.industry}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Sävyn valinta</label>
          <select
            name="tone"
            value={generateInfo.tone}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Innostunut">Innostunut</option>
            <option value="Asiallinen">Asiallinen</option>
            <option value="Hauska">Hauska</option>
            <option value="Rento">Rento</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 mb-1">Kampanjan teema</label>
          <input
            type="text"
            name="campaign"
            value={generateInfo.campaign}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'Generoi...' : 'Generoi sisältö'}
        </button>
      </form>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {posts.length > 0 && (
        <div className="mt-6 space-y-6">
          {posts.map((post, idx) => (
            <div key={idx} className="bg-white p-6 rounded-lg shadow">
              {post.date && <p className="text-gray-500 mb-2 font-medium">{post.date}</p>}
              <p className="text-gray-800 mb-3">{post.text}</p>
              {post.image_url && (
                <img
                  src={post.image_url}
                  alt="Generated visual"
                  className="w-full h-auto rounded mb-3"
                />
              )}
              {post.hashtags && post.hashtags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.hashtags.map((tag, tagIdx) => (
                    <span
                      key={tagIdx}
                      className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

function App() {
  // View state controls which page is shown
  const [view, setView] = useState('home');

  // Form state for registration page
  const [registerInfo, setRegisterInfo] = useState({
    companyName: '',
    industry: '',
    email: '',
    password: '',
  });

  // Form state for login page
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: '',
  });

  // Form state for generating content
  const [generateInfo, setGenerateInfo] = useState({
    companyName: '',
    industry: '',
    tone: 'Innostunut',
    campaign: '',
  });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

  // Handlers for registration inputs and submission
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    // Here you'd typically send registerInfo to a backend
    // For this example, pre-fill generateInfo and proceed to generate view
    setGenerateInfo((prev) => ({
      ...prev,
      companyName: registerInfo.companyName,
      industry: registerInfo.industry,
    }));
    setView('generate');
  };

  // Handlers for login inputs and submission
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    // Authentication logic would go here
    setView('generate');
  };

  // Handlers for content generation inputs and submission
  const handleGenerateChange = (e) => {
    const { name, value } = e.target;
    setGenerateInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerateSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPosts([]);
    try {
      const response = await fetch(`${API_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(generateInfo),
      });
      if (!response.ok) {
        throw new Error('Failed to generate content');
      }
      const data = await response.json();
      // Support both array responses and object wrappers
      const postsArray = Array.isArray(data)
        ? data
        : data.posts || data.content || [];
      setPosts(postsArray);
    } catch (err) {
      setError(err.message || 'Jokin meni pieleen');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans">
      {view === 'home' && <Home setView={setView} />}
      {view === 'register' && (
        <Register
          registerInfo={registerInfo}
          handleChange={handleRegisterChange}
          handleSubmit={handleRegisterSubmit}
          setView={setView}
        />
      )}
      {view === 'login' && (
        <Login
          loginInfo={loginInfo}
          handleChange={handleLoginChange}
          handleSubmit={handleLoginSubmit}
          setView={setView}
        />
      )}
      {view === 'generate' && (
        <Generate
          generateInfo={generateInfo}
          handleChange={handleGenerateChange}
          handleSubmit={handleGenerateSubmit}
          posts={posts}
          loading={loading}
          error={error}
          setView={setView}
        />
      )}
    </div>
  );
}

export default App;
