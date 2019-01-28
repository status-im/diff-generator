import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';

import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

import history from './history';
import Diffs from './Diffs'

const client = new ApolloClient({uri: 'http://localhost:8000/graphql'});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Router path="/" history={history}>
      <div className="App">
        <h1>TEST APP</h1>
        <Diffs/>
      </div>
    </Router>
  </ApolloProvider>,
  document.getElementById('app')
);
