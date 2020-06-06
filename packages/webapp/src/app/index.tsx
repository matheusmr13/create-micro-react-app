import React from 'react';

import { HashRouter as Router } from 'react-router-dom';

import MainRouter from './router';

function App() {
  return (
    <Router>
      <MainRouter />
    </Router>
  );
}

export default App;
