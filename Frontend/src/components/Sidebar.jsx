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

  // Toggle dropdown function
  const toggleDropdown = useCallback((menu) => {
    setOpenDropdown((prev) => ({ ...prev, [menu]: !prev[menu] }));
  }, []);

  // Sidebar menu items with icons
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
      className={`fixed top-0 left-0 h-full bg-blue-300   transition-all duration-300 ${
        isSidebarOpen ? "w-64 p-5" : "w-0"
      }`}
    >
      {isSidebarOpen && (
        <>
          

          <ul>
            {menuItems.map((item, index) => (
              <li key={index} className="mb-4  mt-2">
                {item.subMenu ? (
                  <>
                    {/* Dropdown Button */}
                    <button
                      onClick={() => toggleDropdown(item.name)}
                      className="flex items-center w-full p-3 rounded-md duration-300 hover:bg-gray-100 justify-between"
                      aria-expanded={openDropdown[item.name]}
                    >
                      <span className="flex items-center gap-3">
                        {item.icon}
                        {item.name}
                      </span>
                      <FaChevronDown
                        className={`transition-transform ${
                          openDropdown[item.name] ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {openDropdown[item.name] && (
                      <ul className="ml-4 mt-2 space-y-2">
                        {item.subMenu.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              to={subItem.path}
                              className={`block p-2 rounded-lg duration-300  transition-colors ${
                                location.pathname === subItem.path
                                  ? "bg-blue-600 text-white"
                                  : "hover:bg-gray-100"
                              } `}
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
                    className={`flex items-center p-3 rounded-lg duration-300 transition-colors gap-3 ${
                      location.pathname === item.path
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Sidebar;
