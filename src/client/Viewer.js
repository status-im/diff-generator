import React, { Component } from 'react'
import { styled, Block, Divider } from 'fannypack'

import DiffView from './DiffView'
import DiffsList from './DiffsList'
import DiffsTable from './DiffsTable'

export default class Viewer extends Component {
  render() {
    return <DiffView diffName={this.props.diffName}/>
  }
}
