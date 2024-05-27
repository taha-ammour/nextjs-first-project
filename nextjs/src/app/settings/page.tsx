'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const SettingsPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [username, setUsername] = useState(session?.user?.name || '');
  const [email, setEmail] = useState(session?.user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
        <h1 className="text-4xl mb-6">You are not signed in</h1>
        <button
          onClick={() => router.push('/auth/login')}
          className="bg-red-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-red-700 transition"
        >
          Sign In
        </button>
      </div>
    );
  }

  const handleUpdateProfile = async () => {
    try {
      await axios.put('/api/auth/update', {
        name: username,
        email: email,
      });
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Error updating profile. Please try again.');
    }
  };

  const handleChangePassword = async () => {
    try {
      await axios.put('/api/auth/change-password', {
        currentPassword: currentPassword,
        newPassword: newPassword,
      });
      setMessage('Password changed successfully!');
    } catch (error) {
      setMessage('Error changing password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#131313] text-white flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold mb-8 mt-10">Settings</h1>
      <div className="w-full max-w-2xl bg-[#1c1c1c] p-6 rounded-lg shadow-lg space-y-6">
        <div className="flex flex-col space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Account Information</h2>
            <div className="mt-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-[#333] text-white rounded-md shadow-sm focus:ring focus:ring-opacity-50"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-[#333] text-white rounded-md shadow-sm focus:ring focus:ring-opacity-50"
              />
            </div>
            <button
              onClick={handleUpdateProfile}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition"
            >
              Update Profile
            </button>
          </div>
          <div className="pt-4 border-t border-gray-700">
            <h2 className="text-xl font-semibold">Change Password</h2>
            <div className="mt-4">
              <label htmlFor="current-password" className="block text-sm font-medium text-gray-300">
                Current Password
              </label>
              <input
                type="password"
                id="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-[#333] text-white rounded-md shadow-sm focus:ring focus:ring-opacity-50"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="new-password" className="block text-sm font-medium text-gray-300">
                New Password
              </label>
              <input
                type="password"
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-[#333] text-white rounded-md shadow-sm focus:ring focus:ring-opacity-50"
              />
            </div>
            <button
              onClick={handleChangePassword}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              Change Password
            </button>
          </div>
          <div className="pt-4 border-t border-gray-700">
            <button
              onClick={() => signOut()}
              className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-700 transition w-full"
            >
              Sign Out
            </button>
          </div>
          {message && <p className="mt-4 text-center text-sm text-green-500">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
