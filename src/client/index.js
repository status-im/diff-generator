import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from 'react-router-dom'
import ApolloClient from "apollo-boost"
import { ApolloProvider } from "react-apollo"
import { ThemeProvider, Container, Column, Columns, Box } from 'fannypack'



import history from './history'
import Header from './Header'
import Diffs from './Diffs'

const client = new ApolloClient({uri: 'http://localhost:8000/graphql'})

const App = () => (
  <ThemeProvider>
    <ApolloProvider client={client}>
      <Router path="/" history={history}>
        <Container>
          <Header/>
          <Columns padding="0.5rem">
            <Column spread={3}>
              <Box backgroundColor="whitesmoke" padding="0.5rem">
                <h1>WAT</h1>
              </Box>
            </Column>
            <Column spread={9}>
              <Box backgroundColor="whitesmoke" padding="0.5rem">
                <Diffs/>
              </Box>
            </Column>
          </Columns>
        </Container>
      </Router>
    </ApolloProvider>
  </ThemeProvider>
)

ReactDOM.render(<App/>, document.getElementById('app')
)
