import React from 'react';

export const NotFound = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600">404</h1>
        <p className="mt-4 text-lg text-gray-700">Oops! The page you're looking for doesn't exist.</p>
        <p className="mt-2 text-md text-gray-500">Maybe you mistyped the URL or the page has been moved.</p>
        <a
          href="/"
          className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition"
        >
          Go to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
