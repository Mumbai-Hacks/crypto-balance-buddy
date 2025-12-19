import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="container mx-auto text-zinc-300 flex flex-col justify-center items-center h-full min-h-[60vh] gap-4">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-xl">Page not found</p>
      <Link 
        to="/" 
        className="mt-4 px-6 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors"
      >
        Go Home
      </Link>
    </div>
  );
}

export default NotFound;
