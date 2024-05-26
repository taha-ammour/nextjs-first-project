'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import Link from 'next/link';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    gsap.fromTo(
      headingRef.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 }
    );
    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.5 }
    );
  }, []);

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

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: username, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        gsap.to(formRef.current, {
          opacity: 0,
          y: -50,
          duration: 0.5,
          ease: 'power3.in',
          onComplete: () => {
            router.push('/auth/login');
          },
        });
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (error) {
      setError('Registration failed');
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-900 py-2">
      <div
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: "url('/registerstyle.webp')" }} 
      />
      <div className="absolute inset-0 bg-black opacity-75 z-0" />
      <h1 ref={headingRef} className="text-4xl text-white mb-8 z-10 font-bold">
        Register
      </h1>
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
          <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border border-gray-600 rounded w-full py-3 px-4 text-white bg-gray-700 leading-tight focus:outline-none focus:border-red-500"
            required
          />
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
        <div className="flex justify-center mb-4">
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-full focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
          >
            Register
          </button>
        </div>
        <div className="mt-4 text-center z-10">
          <Link href="/auth/login" legacyBehavior>
            <a className="text-blue-500 hover:text-blue-700 transition duration-300 ease-in-out">
              Already have an account? <span className="underline">Login</span>
            </a>
          </Link>
        </div>
      </form>
    </div>
  );
}
