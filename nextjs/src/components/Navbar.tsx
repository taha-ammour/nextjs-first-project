'use client';
import { useState, useEffect, useRef } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { GiAlienFire, GiWorld, GiSettingsKnobs, GiFilmStrip } from "react-icons/gi";
import { FaTv } from "react-icons/fa";
import { AiOutlineHome, AiOutlineInfoCircle, AiOutlinePhone, AiOutlineClockCircle, AiOutlineUser } from "react-icons/ai";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";

const Navbarfunc = () => {
  const currentPath = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navbarRef = useRef(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (isOpen) {
      gsap.to(navbarRef.current, { duration: 0.5, x: 0, ease: "power3.out" });
    } else {
      gsap.to(navbarRef.current, { duration: 0.5, x: "-100%", ease: "power3.in" });
    }
  }, [isOpen]);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeNavbar = () => {
    setIsOpen(false);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  const themeColors = {
    background: "#141414",
    text: "#E5E5E5",
    accent: "#E50914",
  };

  return (
    <>
      <div className="fixed top-0 right-0 p-4 z-50">
        {session ? (
          <div className="relative">
            <button onClick={toggleDropdown} className="flex items-center space-x-2 text-white focus:outline-none">
              <AiOutlineUser className="text-2xl" />
              <span>{session.user.name}</span>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-fit bg-gray-800 rounded-lg shadow-lg">
                <div className="p-4 text-sm text-white">
                  <p className="mb-2">Signed in as {session.user.email}</p>
                  <button
                    onClick={() => signOut()}
                    className="w-full text-left px-2 py-1 rounded hover:bg-gray-700"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button onClick={() => signIn()} className="text-white">
            <AiOutlineUser className="text-2xl" />
          </button>
        )}
      </div>
      <button className="text-gray-300 hover:text-white focus:outline-none sm:flex" onClick={toggleNavbar}>
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>
      {isOpen && <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={closeNavbar}></div>}
      <nav
        ref={navbarRef}
        className="fixed top-0 left-0 w-full h-full md:w-64 flex flex-col justify-between z-50 items-center bg-gray-900 sm:w-full transform -translate-x-full transition-transform duration-500 shadow-lg"
        style={{ backgroundColor: themeColors.background, color: themeColors.text }}
      >
        <div className="flex flex-col items-center w-full">
          <button className="text-gray-300 hover:text-white focus:outline-none sm:flex md:hidden" onClick={toggleNavbar}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
          <div className="w-full h-20 flex items-center justify-between px-4">
            <Link href="/">
              <GiAlienFire className="text-red-500 animate-pulse text-4xl" />
            </Link>
          </div>
          <div className="w-full border-t border-gray-700 py-2">
            <Link href="/" className={`flex px-4 py-2 hover:bg-gray-700 rounded items-center ${currentPath === '/' ? 'bg-red-500' : ''}`}>
              <AiOutlineHome className="mr-4" />
              Home
            </Link>
            <Link href="/browse" className={`flex px-4 py-2 hover:bg-gray-700 rounded items-center ${currentPath === '/browse' ? 'bg-red-500' : ''}`}>
              <GiWorld className="mr-4" />
              Browse
            </Link>
            <Link href="/movies" className={`flex px-4 py-2 hover:bg-gray-700 rounded items-center ${currentPath === '/movies' ? 'bg-red-500' : ''}`}>
              <GiFilmStrip className="mr-4" />
              Movies
            </Link>
            <Link href="/series" className={`flex px-4 py-2 hover:bg-gray-700 rounded items-center ${currentPath === '/series' ? 'bg-red-500' : ''}`}>
              <FaTv className="mr-4" />
              Series
            </Link>
            <Link href="/watch-later" className={`flex px-4 py-2 hover:bg-gray-700 rounded items-center ${currentPath === '/watch-later' ? 'bg-red-500' : ''}`}>
              <AiOutlineClockCircle className="mr-4" />
              Watch Later
            </Link>
          </div>
        </div>
        <div className="w-full border-t border-gray-700 py-2">
          <Link href="/settings" className={`flex px-4 py-2 hover:bg-gray-700 rounded items-center ${currentPath === '/settings' ? 'bg-red-500' : ''}`}>
            <GiSettingsKnobs className="mr-4" />
            Settings
          </Link>
          <Link href="/about" className={`flex px-4 py-2 hover:bg-gray-700 rounded items-center ${currentPath === '/about' ? 'bg-red-500' : ''}`}>
            <AiOutlineInfoCircle className="mr-4" />
            About
          </Link>
          <Link href="/contact" className={`flex px-4 py-2 hover:bg-gray-700 rounded items-center ${currentPath === '/contact' ? 'bg-red-500' : ''}`}>
            <AiOutlinePhone className="mr-4" />
            Contact
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Navbarfunc;
