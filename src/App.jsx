import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Main from "./pages/main/Main";
import TestingMap from "./pages/main/SplashMap";
import Tables from "./components/Tables";
import JobModal from "./components/JobModal";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Main />} />
          <Route path="/alljobs" element={<Tables />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
