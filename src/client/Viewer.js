import React, { Component } from 'react'
import { styled, Columns, Column, Box } from 'fannypack'

import DiffView from './DiffView'
import DiffsList from './DiffsList'

const TallColumns = styled(Columns)`
  flex: 1 1 auto;
`

export default class Viewer extends Component {
  constructor (props) {
    super(props)
    this.state = { selected: props.diffs ? props.diffs[0] : null }
    this.selectDiff = this.selectDiff.bind(this)
  }

  selectDiff(diff) {
    console.log('selectDiff', diff)
    this.setState({selected: diff})
  }

  render() {
    console.log('render:', this.state.selected)
    return (
      <TallColumns padding="0.5rem">
        <Column spread={3}>
          <Box backgroundColor="whitesmoke" padding="0.5rem">
            <DiffsList
              diffs={this.props.diffs}
              selectDiff={this.selectDiff}
            />
          </Box>
        </Column>
        <Column spread={9}>
          <DiffView diff={this.state.selected}/>
        </Column>
      </TallColumns>
    )
  }
}
