import React from "react";

const Navbar = () => {
  return (
    <nav className="bg-gray-200 text-gray-900 p-2">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold">MyLogo</div>

        {/* Navigation Links */}
        <ul className="hidden md:flex space-x-6">
          <li>
            <a href="#" className="hover:text-gray-400">Home</a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-400">About</a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-400">Services</a>
          </li>
          <li>
            <a href="#" className="hover:text-gray-400">Contact</a>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-2xl">☰</button>
      </div>
    </nav>
  );
};

export default Navbar;
