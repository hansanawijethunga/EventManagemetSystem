import React from 'react';
import { FiLoader } from 'react-icons/fi';

const LoadingSpinner = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <FiLoader className="animate-spin h-8 w-8 text-primary-600 mb-4" />
      <p className="text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingSpinner;