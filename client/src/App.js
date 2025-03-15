import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import JoinPage from './JoinPage';
import ButtonPage from "./ButtonPage";
import BrowserSourcePage from "./BrowserSourcePage";
import PrecedenceList from "./PrecedenceList";
import AdminPage from "./AdminPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/GiggleGames/" element={<JoinPage />} />
        <Route path="/GiggleGames/button/:playerId" element={<ButtonPage />} />
        <Route path="/GiggleGames/browsersource" element={<BrowserSourcePage />} />
        <Route path="/GiggleGames/presslist" element={<PrecedenceList />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
