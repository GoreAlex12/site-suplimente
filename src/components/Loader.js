import React from "react";

const Loader = ({ text = "Se incarca..." }) => (
  <div className="flex items-center justify-center py-12 text-gray-500">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mr-3"></div>
    <span>{text}</span>
  </div>
);

export default Loader;
