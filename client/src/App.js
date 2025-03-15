import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JoinPage from './JoinPage';
import ButtonPage from "./ButtonPage";
import BrowserSourcePage from "./BrowserSourcePage";
import PrecedenceList from "./PrecedenceList";
import AdminPage from "./AdminPage";

function App() {
  const urlprefix = "/GiggleGames";

  return (
    <Router>
      <Routes>
        <Route path={`${urlprefix}/`} element={<JoinPage />} />
        <Route path={`${urlprefix}/button/:playerId`} element={<ButtonPage />} />
        <Route path={`${urlprefix}/browsersource`} element={<BrowserSourcePage />} />
        <Route path={`${urlprefix}/presslist`} element={<PrecedenceList />} />
        <Route path={`${urlprefix}/admin`} element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
