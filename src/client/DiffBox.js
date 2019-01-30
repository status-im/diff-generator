import React, { Component } from 'react'
import { styled, Block, Card, Divider } from 'fannypack'

import DiffStatus from './DiffStatus'
import DiffView from './DiffView'

const SmallCard = styled(Card)`
  padding: 0.4rem;
`

export default class DiffBox extends Component {
  render() {
    return (
      <SmallCard
        title={
          <Block backgroundColor="lightgrey">
            {this.props.diff.name}
          </Block>
        }
        footer={
          <Block justifyContent="flex-end">
            <small>{this.props.diff.created}</small>
          </Block>
        }
      >
        <code>{this.props.diff.builds[0].filename}</code>
        <b>{this.props.diff.builds[0].name}</b>
        <Divider/>
        <code>{this.props.diff.builds[0].filename}</code>
        <b>{this.props.diff.builds[1].name}</b>
      </SmallCard>
    )
  }
}
