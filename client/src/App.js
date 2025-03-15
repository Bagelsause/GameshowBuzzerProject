import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JoinPage from './JoinPage';
import ButtonPage from "./ButtonPage";
import BrowserSourcePage from "./BrowserSourcePage";
import PrecedenceList from "./PrecedenceList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<JoinPage />} />
        <Route path="/button/:playerId" element={<ButtonPage />} />
        <Route path="/browsersource" element={<BrowserSourcePage />} />
        <Route path="/precedenceList" element={<PrecedenceList />} />
      </Routes>
    </Router>
  );
}

export default App;
