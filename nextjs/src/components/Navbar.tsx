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

  const [isOpen, setIsOpen] = useState(true);

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

  const closeNavbar = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button className="text-gray-300 hover:text-white focus:outline-none sm:flex " onClick={() => setIsOpen(!isOpen)}>
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black opacity-50" onClick={closeNavbar}></div>
          <nav
            className="fixed top-0 left-0 w-full h-full md:w-52 flex flex-col items-center bg-gray-800 sm:w-full md:flex sm:justify-center md:justify-normal"
            style={{ backgroundColor: currentTheme.background, color: currentTheme.text }}
          >
            <button className="text-gray-300 hover:text-white focus:outline-none sm:flex md:hidden" onClick={() => setIsOpen(!isOpen)}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
            <div className="w-full h-20 flex items-center justify-between px-4 ">
              <Link href="/">
                <GiAlienFire className="text-red-500 animate-pulse text-4xl" />
              </Link>
            </div>
            <div className="w-full border-t border-gray-700 py-2">
              <Link href="/" className="flex px-4 py-2 hover:bg-gray-700 rounded items-center">
                <GiWorld className="flex mr-6 justify-evenly" />
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
          </nav>
        </>
      )}
    </>
  );
};

export default Navbar;
