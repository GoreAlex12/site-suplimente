import React from "react";
import { FaCheckCircle, FaInfoCircle, FaExclamationCircle, FaExclamationTriangle } from "react-icons/fa";

const config = {
  info: {
    style: "bg-blue-50 border-blue-200 text-blue-800",
    icon: <FaInfoCircle className="text-blue-500 flex-shrink-0 mt-0.5" size={16} />,
  },
  success: {
    style: "bg-green-50 border-green-200 text-green-800",
    icon: <FaCheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={16} />,
  },
  error: {
    style: "bg-red-50 border-red-200 text-red-800",
    icon: <FaExclamationCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />,
  },
  warning: {
    style: "bg-amber-50 border-amber-200 text-amber-800",
    icon: <FaExclamationTriangle className="text-amber-500 flex-shrink-0 mt-0.5" size={16} />,
  },
};

const Message = ({ type = "info", children }) => {
  const { style, icon } = config[type] || config.info;
  return (
    <div
      className={`flex items-start gap-3 border rounded-xl px-4 py-3.5 my-3 text-sm font-medium ${style}`}
    >
      {icon}
      <span>{children}</span>
    </div>
  );
};

export default Message;
