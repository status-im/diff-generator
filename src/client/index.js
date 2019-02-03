import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router-dom'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import { styled, ThemeProvider, Container } from 'fannypack'
import { createGlobalStyle } from 'styled-components'

import theme from './theme'
import history from './history'
import Main from './Main'

const GlobalStyle = createGlobalStyle`
  html, body, div#app {
    margin: 0;
    height: 100%;
    font-size: 0.90em !important;
    background-color: darkgrey;
  }
  iframe {
    overflow: visible;
  }
  a {
    text-decoration: none;
  }
`

const client = new ApolloClient({
  uri: 'http://localhost:8000/graphql'
})

const App = () => (
  <ThemeProvider theme={theme}>
    <GlobalStyle/>
    <Router path="/" history={history}>
      <ApolloProvider client={client}>
        <Main/>
      </ApolloProvider>
    </Router>
  </ThemeProvider>
)

ReactDOM.render(<App/>, document.getElementById('app'))
