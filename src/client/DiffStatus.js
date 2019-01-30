import React, { Component } from 'react'
import { Tag } from 'fannypack'

export default class DiffStatus extends Component {
  render() {
    const paletteMap = {
      'wip':       'primary',
      'failure':   'danger',
      'same':      'success',
      'different': 'warning',
    }
    return (
      <Tag palette={paletteMap[this.props.status] || 'info'}>
        {this.props.status.toUpperCase()}
      </Tag>
    )
  }
}
