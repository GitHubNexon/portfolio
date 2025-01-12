import React, { useState, useEffect } from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";

const Mode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Toggle theme
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Apply the theme to the body tag
  useEffect(() => {
    document.body.setAttribute("data-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return (
      <button
        onClick={toggleTheme}
        className="p-3 text-2xl rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-md hover:shadow-lg transition-all"
        aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
      >
        {isDarkMode ? <MdLightMode /> : <MdDarkMode />}
      </button>
  );
};

export default Mode;
