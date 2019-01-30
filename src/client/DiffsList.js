import React, { Component } from 'react'
import { styled, Columns, Column, Block } from 'fannypack'

import DiffBox from './DiffBox'

const MarginBlock = styled(Block)`
  margin: 0.5rem;
`

export default class DiffsList extends Component {
  render() {
    let idx = 0
    let diffs = this.props.diffs || []
    return (
      <Columns>
        <Column>
        {diffs.map(diff => (
          <MarginBlock key={idx++}>
            <DiffBox diff={diff} />
          </MarginBlock>
        ))}
        </Column>
      </Columns>
    )
  }
}
