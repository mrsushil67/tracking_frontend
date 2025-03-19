import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Main from "./pages/main/Main";
import TestingMap from "./pages/main/SplashMap";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Main />} />
          {/* <Route path="/test" element={<TestingMap />} /> */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
