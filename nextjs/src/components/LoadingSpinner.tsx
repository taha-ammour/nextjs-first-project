'use client'
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const LoadingSpinner = () => {
  const spinnerRef = useRef(null);

  useEffect(() => {
    const spinner = spinnerRef.current;
    gsap.fromTo(spinner, { rotation: 0 }, { rotation: 360, repeat: -1, ease: 'linear', duration: 1 });
  }, []);

  return (
    <div ref={spinnerRef} className="flex justify-center items-center w-12 h-12 border-4 border-t-4 border-gray-200 rounded-full border-t-red-600"></div>
  );
};

export default LoadingSpinner;
