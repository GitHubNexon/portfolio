import React from "react";
import Login from "../admin/Login";
import LandingBG from "../assets/Images/image.png";

const Dashboard = () => {
  return (
    <>
      <div className="relative flex items-center justify-center h-screen bg-gray-200">
        <img
          src={LandingBG}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-70"
        />
        <Login />
      </div>
    </>
  );
};

export default Dashboard;
