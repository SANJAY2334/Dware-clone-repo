import React from "react";
import { FaPlus, FaPencilAlt, FaUpload } from "react-icons/fa";

const DataSourceCard = ({ name, icon, isEditable, isUploadable }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center transition delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:bg-blue-200  justify-center w-40 h-40 relative">
      {/* Icon */}
      <img src={icon} alt={name} className="w-12 h-12 mb-2 object-scale-down" />

      {/* Name */}
      <p className="text-gray-700 font-semibold">{name}</p>

      {/* Actions */}
      <div className="absolute bottom-2 right-2 flex space-x-2">
        {isEditable && <FaPencilAlt className="text-gray-500 hover:text-blue-500 cursor-pointer" />}
        {isUploadable ? (
          <FaUpload className="text-green-500 hover:text-green-600 cursor-pointer" />
        ) : (
          <FaPlus className="text-blue-500 hover:text-blue-600 cursor-pointer" />
        )}
      </div>
    </div>
  );
};

export default DataSourceCard;
