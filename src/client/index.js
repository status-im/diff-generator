import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router-dom'
import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'
import { styled, ThemeProvider, Container, Column, Columns, Box } from 'fannypack'
import { createGlobalStyle } from 'styled-components'

import theme from './theme'
import history from './history'
import Header from './Header'
import Diffs from './Diffs'

const GlobalStyle = createGlobalStyle`
  html, body, div#app {
    margin: 0;
    height: 100%;
  }
`

const client = new ApolloClient({uri: 'http://localhost:8000/graphql'})

const App = () => (
  <ThemeProvider theme={theme}>
    <GlobalStyle/>
    <ApolloProvider client={client}>
      <Router path="/" history={history}>
        <Container>
          <Header/>
          <Diffs/>
        </Container>
      </Router>
    </ApolloProvider>
  </ThemeProvider>
)

ReactDOM.render(<App/>, document.getElementById('app'))
