import React from 'react';
import { Link } from 'react-router-dom';

const AdminPage = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Admin Page</h1>
      <ul>
        <li>
          <Link to="/">Give to Players</Link>
        </li>
        <li>
          <Link to="/presslist">Press Order List</Link>
        </li>
        <li>
          <Link to="/browsersource">Browser Source ONLY</Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminPage;