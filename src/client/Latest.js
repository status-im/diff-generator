import React, { Component } from 'react'
import { styled, Heading, Box, Card } from 'fannypack'

const LatestBox = styled(Box)`
  width: 50%;
  margin: 0 auto;
`

export default class Latest extends Component {
  render() {
    return (
      <LatestBox>
        <Card title="Placeholder">
          This could hold most recently created diffs to browse or something.
        </Card>
      </LatestBox>
    )
  }
}
