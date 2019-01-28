import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import history from './history.js';

ReactDOM.render(
  <Router path="/" history={history}>
    <div className="App">
      <h1>TEST APP</h1>
    </div>
  </Router>,
  document.getElementById('app')
);
