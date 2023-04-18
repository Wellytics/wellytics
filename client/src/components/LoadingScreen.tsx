import React from "react";

// A beautiful tailwind loading screen
export const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        <h1 className="text-3xl mt-4">Loading...</h1>
      </div>
    </div>
  );
};
