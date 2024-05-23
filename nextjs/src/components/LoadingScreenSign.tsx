'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function LoadingScreen() {
  const loadingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(loadingRef.current, { opacity: 1 }, { opacity: 0, duration: 1, delay: 1, ease: 'power3.out' });
  }, []);

  return (
    <div ref={loadingRef} className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <div className="spinner border-t-4 border-b-4 border-red-600 rounded-full w-16 h-16 animate-spin"></div>
    </div>
  );
}