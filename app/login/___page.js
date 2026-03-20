'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, register } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let data;
      if (isRegister) {
        data = await register(email, password, fullName, company);
        if (data.success && data.data.apiKey) {
          setApiKey(data.data.apiKey);
        }
      } else {
        data = await login(email, password);
      }

      if (data.success) {
        if (!apiKey) router.push('/dashboard');
      } else {
        setError(data.error?.message || 'Authentication failed');
      }
    } catch (err) {
      setError('Connection failed. Is the API running?');
    }
    setLoading(false);
  };

  if (apiKey) {
    return (
      <div className="min-h-screen bg-dark-400 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-dark-100 border border-navy-700 rounded-2xl p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✓</span>
              </div>
              <h1 className="text-2xl font-bold text-white">Account Created!</h1>
              <p className="text-gray-400 mt-2">Save your API key — it will not be shown again</p>
            </div>

            <div className="bg-dark-300 border border-teal-400/30 rounded-lg p-4 mb-6">
              <div className="text-xs text-teal-400 mb-2 font-semibold">YOUR API KEY</div>
              <code className="text-sm text-white break-all select-all">{apiKey}</code>
            </div>

            <p className="text-xs text-gray-500 mb-6">
              Use this key in your desktop app's api_config.json to connect to the platform.
            </p>

            <button onClick={() => router.push('/dashboard')}
              className="w-full bg-gradient-to-r from-navy-500 to-teal-400 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-400 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-dark-100 border border-navy-700 rounded-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-navy-500 to-teal-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">O</span>
            </div>
            <h1 className="text-2xl font-bold text-white">
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-gray-400 mt-2">
              {isRegister ? 'Join the Oblivion platform' : 'Sign in to Oblivion'}
            </p>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-3 mb-6">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Full Name</label>
                  <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border text-sm" placeholder="Alberto Conte" required />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">Company</label>
                  <input type="text" value={company} onChange={e => setCompany(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border text-sm" placeholder="Studio Conte S.r.l." />
                </div>
              </>
            )}
            <div>
              <label className="text-sm text-gray-400 block mb-1">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border text-sm" placeholder="you@company.com" required />
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-1">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border text-sm" placeholder="Min 8 characters" required minLength={8} />
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-navy-500 to-teal-400 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 mt-2">
              {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="text-center mt-6">
            <button onClick={() => { setIsRegister(!isRegister); setError(''); }}
              className="text-teal-400 text-sm hover:underline">
              {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register"}
            </button>
          </div>
        </div>

        {/* Public verify link */}
        <div className="text-center mt-4">
          <a href="/verify" className="text-gray-500 text-sm hover:text-teal-400 transition-colors">
            Verify a deletion certificate →
          </a>
        </div>
      </div>
    </div>
  );
}
