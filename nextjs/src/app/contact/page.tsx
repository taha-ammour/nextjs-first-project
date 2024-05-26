'use client'
import React, { useEffect, useRef, useState } from 'react';
import Navbar from "@/components/Navbar";
import { gsap } from 'gsap';
import { SessionProvider } from 'next-auth/react';

const Contact = () => {
  const contactRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    gsap.fromTo(
      contactRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (<SessionProvider>
    <div className="min-h-screen bg-[#141414] text-white">
      <Navbar />
      <div className="container mx-auto p-8" ref={contactRef}>
        <div className="bg-[#1c1c1c] p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-center text-[#E50914] ">Contact Us</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-lg">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-800 text-white focus:border focus:outline-none focus:border-red-600"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-lg">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:border focus:border-red-600"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-lg">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-800 text-white focus:outline-none focus:border focus:border-red-600"
                rows={5}
              />
            </div>
            <button type="submit" className="w-full p-3 bg-red-500 rounded-lg hover:bg-red-600 text-white">Send Message</button>
          </form>
        </div>
      </div>
    </div>
    </SessionProvider>
  );
};

export default Contact;
