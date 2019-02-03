import React, { Component } from 'react'
import { styled, Block, Divider } from 'fannypack'

import DiffView from './DiffView'

export default class Viewer extends Component {
  render() {
    return <DiffView diffName={this.props.diffName}/>
  }
}
