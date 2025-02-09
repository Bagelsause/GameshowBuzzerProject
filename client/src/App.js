import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JoinPage from './JoinPage';
import ButtonPage from "./ButtonPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<JoinPage />} />
        <Route path="/button/:playerId" element={<ButtonPage />} />
      </Routes>
    </Router>
  );
}

export default App;
