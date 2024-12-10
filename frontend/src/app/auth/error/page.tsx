import React from 'react';

const Error = ({ message }: { message: string }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-red-100">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <p className="mt-4 text-gray-700">{message}</p>
      </div>
    </div>
  );
};

export default Error;
