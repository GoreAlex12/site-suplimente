import React from "react";

const Loader = ({ text = "Se incarca..." }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-4">
    <div className="relative h-10 w-10">
      <div className="absolute inset-0 rounded-full border-[3px] border-gray-200" />
      <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-green-600 animate-spin" />
    </div>
    <span className="text-sm text-gray-500 font-medium">{text}</span>
  </div>
);

export default Loader;
