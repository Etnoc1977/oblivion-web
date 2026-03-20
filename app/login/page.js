'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login, register, loginWithGoogle } from '@/lib/api';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');

  // Handle Google OAuth callback
  useEffect(() => {
    const handleCallback = async () => {
      // Check if we're returning from Google OAuth
      const hash = window.location.hash;
      if (hash && hash.includes('access_token')) {
        setGoogleLoading(true);
        setError('');

        try {
          // Supabase automatically picks up the session from the URL hash
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();

          if (sessionError || !session) {
            setError('Google sign-in failed. Please try again.');
            setGoogleLoading(false);
            return;
          }

          // Exchange Supabase token for Oblivion JWT
          const result = await loginWithGoogle(session.access_token);

          if (result.success) {
            // Clean up the URL hash
            window.history.replaceState(null, '', '/login');
            router.push('/dashboard');
          } else {
            setError(result.error?.message || 'Failed to complete Google sign-in');
          }
        } catch (err) {
          console.error('Google auth callback error:', err);
          setError('Google sign-in failed. Please try again.');
        }
        setGoogleLoading(false);
      }
    };

    handleCallback();
  }, [router]);

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

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/login',
        },
      });

      if (error) {
        setError('Failed to initiate Google sign-in');
        setGoogleLoading(false);
      }
      // If no error, the browser will redirect to Google
    } catch (err) {
      setError('Failed to connect to Google');
      setGoogleLoading(false);
    }
  };

  // Show loading while processing Google callback
  if (googleLoading) {
    return (
      <div className="min-h-screen bg-[#090c16] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-[#1e3a8a] to-[#1db4c8] rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-2xl">O</span>
          </div>
          <p className="text-[#1db4c8] text-lg">Completing Google sign-in...</p>
        </div>
      </div>
    );
  }

  if (apiKey) {
    return (
      <div className="min-h-screen bg-[#090c16] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-[#111422] border border-[#1e3a8a] rounded-2xl p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-[#1db4c8] rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✓</span>
              </div>
              <h1 className="text-2xl font-bold text-white">Account Created!</h1>
              <p className="text-gray-400 mt-2">Save your API key — it will not be shown again</p>
            </div>

            <div className="bg-[#0d101c] border border-[#1db4c8]/30 rounded-lg p-4 mb-6">
              <div className="text-xs text-[#1db4c8] mb-2 font-semibold">YOUR API KEY</div>
              <code className="text-sm text-white break-all select-all">{apiKey}</code>
            </div>

            <p className="text-xs text-gray-500 mb-6">
              Use this key in your desktop app's api_config.json to connect to the platform.
            </p>

            <button onClick={() => router.push('/dashboard')}
              className="w-full bg-gradient-to-r from-[#1e3a8a] to-[#1db4c8] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090c16] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#111422] border border-[#1e3a8a] rounded-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-[#1e3a8a] to-[#1db4c8] rounded-2xl flex items-center justify-center mx-auto mb-4">
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

          {/* Google Sign-In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading || googleLoading}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 mb-6"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[#1e3a8a]/30"></div>
            <span className="text-gray-500 text-sm">or</span>
            <div className="flex-1 h-px bg-[#1e3a8a]/30"></div>
          </div>

          {/* Email/Password Form */}
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
              className="w-full bg-gradient-to-r from-[#1e3a8a] to-[#1db4c8] text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 mt-2">
              {loading ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="text-center mt-6">
            <button onClick={() => { setIsRegister(!isRegister); setError(''); }}
              className="text-[#1db4c8] text-sm hover:underline">
              {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register"}
            </button>
          </div>
        </div>

        {/* Public verify link */}
        <div className="text-center mt-4">
          <a href="/verify" className="text-gray-500 text-sm hover:text-[#1db4c8] transition-colors">
            Verify a deletion certificate →
          </a>
        </div>
      </div>
    </div>
  );
}
