import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-blue-100">
     
      <div className=" text-white fixed h-full shadow-lg">
        <Sidebar />
      </div>

      
      <div className="flex-1 flex flex-col ml-64 transition-all duration-300">
       
        <div className="sticky top-0 z-50 shadow-md bg-white">
          <Navbar />
        </div>

       
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
