'use client'
import React, { useEffect, useRef } from 'react';
import Navbar from "@/components/Navbar";
import { gsap } from 'gsap';
import { SessionProvider } from 'next-auth/react';

const About = () => {
  const aboutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      aboutRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
  }, []);

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <SessionProvider><Navbar /></SessionProvider>
      <div className="container mx-auto p-8" ref={aboutRef}>
        <div className="bg-[#1c1c1c] p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-center text-[#E50914]">About Us</h2>
          <p className="mb-4 text-lg">
            Welcome to my movie platform! This page was made by one person and is not for public use.
          </p>
          <p className="mb-4 text-lg">
            I am dedicated to providing you with the latest and greatest in movie entertainment.
          </p>
          <p className="mb-4 text-lg">
            I works tirelessly to bring you a comprehensive database of movies and TV shows, complete with detailed information, trailers, and ratings.
          </p>
          <p className="mb-4 text-lg">
            I strive to make your movie-watching experience as enjoyable as possible, whether you are looking for the latest blockbuster or a hidden gem.
          </p>
          <p className="mb-4 text-lg">
            Thank you for choosing our platform. We hope you enjoy your time here!
          </p>
          <div className="text-center mt-6">
            <a href="/" className="text-blue-500 hover:underline">Back to Home</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
