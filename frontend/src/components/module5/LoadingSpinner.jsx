import React from "react";

export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

        <p className="text-gray-300 text-lg">
          Loading...
        </p>
      </div>
    </div>
  );
}