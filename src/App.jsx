import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Main from "./pages/main/Main";
import TestingMap from "./pages/main/SplashMap";
import Tables from "./pages/jobs/Tables";
import JobModal from "./pages/jobs/JobModal";
import Streaming from "./pages/main/Streaming";
import { Bounce, ToastContainer } from "react-toastify";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Main />} />
          <Route path="/alljobs" element={<Tables />} />
          <Route path="/stream" element={<Streaming />} />
        </Route>
      </Routes>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        rtl={false}
        closeOnClick={false}
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </Router>
  );
};

export default App;
