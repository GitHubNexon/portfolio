import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Mode from "../components/Mode";

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // State for dark mode

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode); // Toggle function

  const scrollToSection = (id) => {
    setMenuOpen(false);
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const links = [
    { name: "About", id: "about" },
    { name: "Services", id: "services" },
    { name: "Contact", id: "contact" },
  ];

  return (
    <nav
      className={` fixed w-full top-0 left-0 z-50 ${isDarkMode ? "dark" : ""}`}
    >
      <div className="mx-auto px-4 flex justify-between items-center h-16">
        {/* Logo */}
        <div
          className="text-2xl font-bold cursor-pointer text-white"
          onClick={() => scrollToSection("about")}
        >
          HackTheAlgo
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-6">
          {links.map((link) => (
            <li
              key={link.name}
              className="cursor-pointer"
              onClick={() => scrollToSection(link.id)}
            >
              {link.name}
            </li>
          ))}
        </ul>

        {/* Dark Mode Toggle for Desktop */}
        <div className="hidden md:block">
          <Mode isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        </div>

        {/* Mobile Menu Icon */}
        <button
          className="md:hidden text-2xl text-white focus:outline-none"
          onClick={toggleMenu}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul className="md:hidden  text-center">
          {links.map((link) => (
            <li
              key={link.name}
              className="py-2 border-b border-blue-500 text-white hover:bg-blue-800"
              onClick={() => scrollToSection(link.id)}
            >
              {link.name}
            </li>
          ))}
          {/* Dark Mode Toggle in Mobile Menu */}
          <li className="py-2">
            <Mode isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
          </li>
        </ul>
      )}
    </nav>
  );
};

export default NavBar;
