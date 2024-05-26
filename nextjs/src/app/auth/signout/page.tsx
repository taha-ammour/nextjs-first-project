'use client';

import { useEffect, useRef } from 'react';
import { signOut } from 'next-auth/react';
import gsap from 'gsap';
import { useRouter } from 'next/navigation';

const SignOut = () => {
  const router = useRouter();
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      popupRef.current,
      { opacity: 0, y: -50 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
    );
  }, []);

  const handleSignOut = () => {
    gsap.to(popupRef.current, {
      opacity: 0,
      y: -50,
      duration: 0.5,
      ease: 'power3.in',
      onComplete: () => {
        signOut({ callbackUrl: '/auth/newuser' });
      },
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
      <div
        ref={popupRef}
        className="bg-[#1c1c1c] text-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center"
      >
        <h1 className="text-2xl mb-4">Sign Out</h1>
        <p className="mb-6">Are you sure you want to sign out?</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleSignOut}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
          >
            Sign Out
          </button>
          <button
            onClick={() => router.push('/')}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignOut;
