import React from "react";
import Link from "next/link";

const Home = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 p-4">
      <div className="text-center bg-white shadow-xl rounded-2xl p-10 max-w-lg w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Welcome to Job Import Tracker
        </h1>
        <p className="text-gray-600 mb-6">
          This dashboard shows import logs from remote job feeds like Jobicy and HigherEdJobs.
        </p>
        <Link
          href="/import-history"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-full transition-all"
        >
          View Import History
        </Link>
      </div>
    </div>
  );
};

export default Home;
