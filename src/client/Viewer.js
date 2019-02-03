import React, { Component } from 'react'
import Iframe from 'react-iframe'
import { styled, Heading, Box, Block } from 'fannypack'

import Viewer from './Viewer'

export default class DiffView extends Component {
  render() {
    let content
    if (!this.props.diffName) {
      content = <Heading>Loading...</Heading>
    } else {
      content = (
        <Iframe
          position="relative"
          display="block"
          allowFullScreen
          scroll="no"
          height="100%"
          url={`/view/${this.props.diffName}`}
        />
      )
    }
    return content
  }
}
