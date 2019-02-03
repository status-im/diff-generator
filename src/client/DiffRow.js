import React, { Component } from 'react'
import { Table } from 'fannypack'

import DiffStatus from './DiffStatus'

export default class DiffRow extends Component {
  render() {
    const diff = this.props.diff
    const rowClass = this.props.selected ? 'selected' : ''
    return (
      <Table.Body hasBorders>
        <Table.Row
          className={rowClass}
          onClick={this.props.selectDiff}
          backgroundColor={this.props.selected?'primaryTint':null}
        >
          <Table.Cell rowSpan={2}><DiffStatus status={diff.status}/></Table.Cell>
          <Table.Cell rowSpan={2}><code>{diff.name}</code></Table.Cell>
          {/*<Table.Cell rowSpan={2}>{diff.type}</Table.Cell>*/}
          <Table.Cell>
            <a href={diff.builds[0].buildUrl}>{diff.builds[0].name}</a>
          </Table.Cell>
          <Table.Cell>
            <a href={diff.builds[0].fileUrl}>{diff.builds[0].filename}</a>
          </Table.Cell>
        </Table.Row>
        <Table.Row
          className={rowClass}
          onClick={this.props.selectDiff}
          backgroundColor={this.props.selected?'primaryTint':null}
        >
          <Table.Cell>
            <a href={diff.builds[1].buildUrl}>{diff.builds[1].name}</a>
          </Table.Cell>
          <Table.Cell>
            <a href={diff.builds[1].fileUrl}>{diff.builds[1].filename}</a>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    )
  }
}

