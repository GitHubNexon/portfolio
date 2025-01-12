import React, { useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Home from "./pages/Home";
import NotFound from "./helpers/NotFound";
import Layout from "./components/Layout";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard.jsx";
import About from "./pages/About";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SplashProvider } from "./context/SplashContext.jsx";
import { LoaderProvider } from "./context/useLoader.jsx";
import { MiscContextProvider } from "./context/MiscContext.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import Services from "./pages/Services.jsx";
import CSM from "./pages/CSM.jsx";
import AboutTable from "./Dashboard/AboutTable.jsx";

function App() {
  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Router basename="/portfolio/">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/CSM052802" element={<CSM />} />
          <Route path="/about-table" element={<AboutTable />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
