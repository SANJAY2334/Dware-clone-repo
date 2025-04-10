// components/DropdownButton.jsx
import { useState, useRef, useEffect } from "react";

const DropdownButton = ({ onAdd, onEdit }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
      >
        ⋮
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-24 bg-white border rounded shadow-md z-10">
          <button
            onClick={() => {
              onAdd();
              setOpen(false);
            }}
            className="block w-full px-4 py-2 text-sm hover:bg-gray-100"
          >
            Add
          </button>
          <button
            onClick={() => {
              onEdit();
              setOpen(false);
            }}
            className="block w-full px-4 py-2 text-sm hover:bg-gray-100"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default DropdownButton;
