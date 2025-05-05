// Navbar.jsx
import React from "react";

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-[#0B0B3B] text-white">
      <h1 className="text-lg font-bold tracking-widest">Check My CV</h1>
      <div className="flex gap-6 items-center text-sm">
        <button className="hover:underline">Products</button>
        <button className="bg-white text-[#0B0B3B] px-4 py-2 rounded-md font-semibold">
          Login
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
