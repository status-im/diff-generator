import React, { Component } from 'react'
import { styled, Grid } from 'fannypack'

import Header from './Header'
import Search from './Search'
import Viewer from './Viewer'
import Latest from './Latest'

const MainGrid = styled(Grid)`
  height: 100%;
  width: 100%;
  grid-template-rows: 5% 25% 70%;
  grid-template-columns: 30% 70%;
  grid-template-areas:
  "header header"
  "search search"
  "viewer viewer";

  @media screen and (min-width: 120em) {
    grid-template-areas:
    "header header"
    "search viewer"
    "search viewer"
  }
`

const HeaderCont = styled(Grid.Item)`
  height: 100%;
  width: 100%;
  padding: 1rem;
  background-color: gainsboro;
  grid-area: header;
`
const SearchCont = styled(Grid.Item)`
  height: 100%;
  width: 100%;
  padding: 1rem;
  background-color: gainsboro;
  grid-area: search;
`
const ViewerCont = styled(Grid.Item)`
  height: 100%;
  width: 100%;
  padding: 1rem;
  background-color: whitesmoke;
  grid-area: viewer;
`

export default class Main extends Component {
  constructor (props) {
    super(props)
    this.state = {viewing: null}
    this.setViewed = this.setViewed.bind(this)
  }

  setViewed (diffName) {
    console.log('Viewed:', diffName)
    this.setState({viewing: diffName})
  }

  render () {
    let viewer = <Viewer diffName={this.state.viewing}/>
    if (!this.state.viewing) {
      viewer = <Latest/>
    }
    return (
      <MainGrid>
        <HeaderCont>
          <Header/>
        </HeaderCont>
        <SearchCont>
          <Search setViewed={this.setViewed}/>
        </SearchCont>
        <ViewerCont>
          {viewer}
        </ViewerCont>
      </MainGrid>
    )
  }
}
