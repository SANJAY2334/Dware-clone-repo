import { Link, useLocation } from "react-router-dom";
import { useState, useCallback } from "react";
import {
  FaChevronDown,
  FaHome,
  FaDatabase,
  FaTable,
  FaClipboardList,
  FaClock,
  FaChartBar,
} from "react-icons/fa";

const Sidebar = ({ isSidebarOpen }) => {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState({});

  const toggleDropdown = useCallback((menu) => {
    setOpenDropdown((prev) => ({ ...prev, [menu]: !prev[menu] }));
  }, []);

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <FaHome /> },
    { name: "Data Sources", path: "/data-sources", icon: <FaDatabase /> },
    { name: "Query Designer", path: "/query-designer", icon: <FaTable /> },
    {
      name: "Comparison",
      icon: <FaClipboardList />,
      subMenu: [
        { name: "Data Comparison", path: "/comparison/data" },
        { name: "Meta Comparison", path: "/comparison/meta" },
        { name: "DB Comparison", path: "/comparison/db" },
      ],
    },
    { name: "Scheduler", path: "/scheduler", icon: <FaClock /> },
    {
      name: "Results",
      icon: <FaChartBar />,
      subMenu: [
        { name: "Query Runs", path: "/results/query-runs" },
        { name: "Compare Runs", path: "/results/compare-runs" },
        { name: "Meta Runs", path: "/results/meta-runs" },
        { name: "DB Compare Runs", path: "/results/db-runs" },
      ],
    },
  ];

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gray-900 text-gray-100 transition-all duration-300 overflow-y-auto ${
        isSidebarOpen ? "w-64 p-5" : "w-0"
      }`}
    >
      {isSidebarOpen && (
        <ul>
          {menuItems.map((item, index) => (
            <li key={index} className="mb-2">
              {item.subMenu ? (
                <>
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className="flex items-center w-full p-3 rounded-md hover:bg-gray-800 justify-between"
                    aria-expanded={openDropdown[item.name]}
                  >
                    <span className="flex items-center gap-3 text-white">
                      {item.icon}
                      {item.name}
                    </span>
                    <FaChevronDown
                      className={`text-gray-300 transition-transform ${
                        openDropdown[item.name] ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openDropdown[item.name] && (
                    <ul className="ml-6 mt-2 space-y-1">
                      {item.subMenu.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <Link
                            to={subItem.path}
                            className={`block p-2 rounded-lg text-sm transition-colors ${
                              location.pathname === subItem.path
                                ? "bg-blue-600 text-white"
                                : "text-gray-300 hover:bg-gray-800 hover:text-white"
                            }`}
                          >
                            {subItem.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link
                  to={item.path}
                  className={`flex items-center p-3 rounded-lg transition-colors gap-3 ${
                    location.pathname === item.path
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Sidebar;
