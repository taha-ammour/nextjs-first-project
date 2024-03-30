'use client'
import { GiAlienFire, GiWorld } from "react-icons/gi";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import clsx from 'clsx';

interface NavbarProps {
  theme: "dark" | "light";
  toggleTheme: () => void;
}

const Navbar = ({ }) => {

  const currentPath = usePathname();

  const [isOpen, setIsOpen] = useState(false);

  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const darkTheme = {
    background: "#1A202C",
    text: "#E2E8F0",
    accent: "#F56565",
  };

  const lightTheme = {
    background: "#FFFFFF",
    text: "#1A202C",
    accent: "#F56565",
  };

  const currentTheme = theme === "dark" ? darkTheme : lightTheme;

  return (
    <nav
      className="fixed left-0 top-0 h-full w-52 flex flex-col items-center bg-gray-800 sm:hidden md:flex"
      style={{ backgroundColor: currentTheme.background, color: currentTheme.text }}
    >
      <div className="w-full h-20 flex items-center justify-between px-4">
        <Link href="/">
          <GiAlienFire className="text-red-500 animate-pulse text-4xl" />
        </Link>
        <button className="text-gray-300 hover:text-white focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </button>
      </div>
      {isOpen && (
        <>
          <div className="w-full border-t border-gray-700 py-2">
            <Link href="/" className="flex px-4 py-2 hover:bg-gray-700 rounded">
              <GiWorld className="flex" />
              Browse
            </Link>
            <Link href="/movies" className="flex px-4 py-2 hover:bg-gray-700 rounded">
              Movies
            </Link>
            <Link href="/about" className="block px-4 py-2 hover:bg-gray-700 rounded">
              About
            </Link>
            <Link href="/contact" className="block px-4 py-2 hover:bg-gray-700 rounded">
              Contact
            </Link>
          </div>
          <div className="flex items-center justify-center w-full py-2">
            <button
              onClick={toggleTheme}
              className="focus:outline-none text-sm text-gray-300 hover:text-white"
            >
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
