import React, { Component } from 'react'
import Iframe from 'react-iframe'
import { Heading, Box } from 'fannypack'

import Viewer from './Viewer'

export default class DiffView extends Component {
  render() {
    let content
    if (!this.props.diff) {
      content = <Heading>Loading...</Heading>
    } else {
      content = (
        <Iframe
          height="80%"
          position="relative"
          display="initial"
          allowFullScreen
          url={`/view/${this.props.diff.name}`}
        />
      )
    }
    return (
      <Box backgroundColor="whitesmoke" padding="0.5rem" height="100%">
        {content}
      </Box>
    )
  }
}
