// src/app/auth/login/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { getProviders, signIn } from 'next-auth/react';
import { LiteralUnion, ClientSafeProvider } from 'next-auth/react';
import { BuiltInProviderType } from 'next-auth/providers/index';

const Login = () => {
  const [providers, setProviders] = useState<Record<LiteralUnion<BuiltInProviderType, string>, ClientSafeProvider> | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProviders = async () => {
      const providers = await getProviders();
      setProviders(providers);
    };
    fetchProviders();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });
    if (result?.error) {
      setError(result.error);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-red-600">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
              Username:
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-200 rounded-md focus:ring-red-600 focus:border-red-600"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password:
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-200 rounded-md focus:ring-red-600 focus:border-red-600"
            />
          </div>
          <button type="submit" className="w-full px-4 py-2 font-semibold text-white bg-red-600 rounded-md hover:bg-red-700">
            Sign in
          </button>
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </form>
        <div>
          <h2 className="mt-6 text-center text-gray-300">Or sign in with</h2>
          <div className="flex flex-col space-y-2">
            {providers &&
              Object.values(providers).map((provider) => (
                provider.id !== 'credentials' && (
                  <button
                    key={provider.name}
                    onClick={() => signIn(provider.id)}
                    className="px-4 py-2 font-semibold text-gray-900 bg-gray-300 rounded-md hover:bg-gray-400"
                  >
                    Sign in with {provider.name}
                  </button>
                )
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
