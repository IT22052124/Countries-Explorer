import React from "react";

const Footer = () => (
  <footer className="w-full py-6 mt-12 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-600 dark:text-gray-400">
    <span>
      &copy; {new Date().getFullYear()} Countries Explorer. All rights reserved.
      | Developed by Shukry (Dedsec)
    </span>
  </footer>
);

export default Footer;
