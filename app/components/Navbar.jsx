"use client";

import React from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-[#0B0B3B] text-white">
      <h1 className="text-lg font-bold tracking-widest">JCUBE AI RESUME BUILDER</h1>
      <div className="flex gap-6 items-center text-sm">
        <Link
          href="/AI"
          className="bg-white text-[#0B0B3B] px-4 py-2 rounded-md font-semibold"
        >
          AI Interview
        </Link>
        {session ? (
          <button
            onClick={() => signOut()}
            className="bg-white text-[#0B0B3B] px-4 py-2 rounded-md font-semibold"
          >
            Sign out
          </button>
        ) : (
          <button
            onClick={() => signIn("google")}
            className="bg-white text-[#0B0B3B] px-4 py-2 rounded-md font-semibold"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
