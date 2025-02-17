import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JoinPage from './JoinPage';
import ButtonPage from "./ButtonPage";
import BrowserSourcePage from "./BrowserSourcePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<JoinPage />} />
        <Route path="/button/:playerId" element={<ButtonPage />} />
        <Route path="/browsersource" element={<BrowserSourcePage />} />
      </Routes>
    </Router>
  );
}

export default App;
