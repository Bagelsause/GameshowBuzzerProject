import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JoinPage from './JoinPage';
// Import your player button page when you create it, e.g.,
// import ButtonPage from './ButtonPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<JoinPage />} />
        {/* Example route for the player's button page */}
        {/* <Route path="/button/:playerId" element={<ButtonPage />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
