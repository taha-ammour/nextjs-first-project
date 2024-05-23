'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import gsap from 'gsap';
import LoadingScreen from '../../../components/LoadingScreenSign';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );
  }, []);

  useEffect(() => {
    if (session) {
      router.push('/');
    }
  }, [session, router]);

  const validateUsername = (username: string) => {
    if (/\s/.test(username)) {
      setUsernameError('Username should not contain spaces.');
      return false;
    }
    setUsernameError('');
    return true;
  };

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      setPasswordError('Password should be at least 8 characters long.');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const isUsernameValid = validateUsername(username);
    const isPasswordValid = validatePassword(password);

    if (!isUsernameValid || !isPasswordValid) {
      return;
    }

    setLoading(true);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        username,
        password,
      });
      if (result?.error) {
        setError(result.error);
        setLoading(false);
      } else {
        gsap.to(formRef.current, {
          opacity: 0,
          y: -50,
          duration: 0.5,
          ease: 'power3.in',
          onComplete: () => {
            router.push('/');
          },
        });
      }
    } catch (error) {
      setError('Login failed');
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return <LoadingScreen />;
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-900 py-2">
      {loading && <LoadingScreen />}
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/images/background.jpg')" }} // Ensure you have a suitable background image in your public/images folder
      />
      <div className="absolute inset-0 bg-black opacity-75 z-0" />
      <h1 className="text-4xl text-white mb-8 z-10 font-bold">Login</h1>
      <form
        onSubmit={handleSubmit}
        ref={formRef}
        className="w-full max-w-md p-8 bg-[#1c1c1c] bg-opacity-95 rounded-lg shadow-lg z-10"
      >
        <div className="mb-6">
          <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="shadow appearance-none border border-gray-600 rounded w-full py-3 px-4 text-white bg-gray-700 leading-tight focus:outline-none focus:border-red-500"
            required
          />
          {usernameError && <p className="text-red-500 text-xs italic mt-2">{usernameError}</p>}
        </div>
        <div className="mb-6">
          <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border border-gray-600 rounded w-full py-3 px-4 text-white bg-gray-700 leading-tight focus:outline-none focus:border-red-500"
            required
          />
          {passwordError && <p className="text-red-500 text-xs italic mt-2">{passwordError}</p>}
        </div>
        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}