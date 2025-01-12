import React from "react";
import NavBar from "../routes/NavBar";
import Services from "../pages/Services.jsx";
import About from "../pages/About";
import Contact from "../pages/Contact.jsx";

const Home = () => {
  return (
    <>
      <div className="overflow-auto">
        <NavBar />
        <About />
        <Services />
        <Contact />
      </div>
    </>
  );
};

export default Home;
