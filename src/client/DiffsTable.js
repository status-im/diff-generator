import React, { Component } from 'react'
import { Table, Alert, List } from 'fannypack'

import DiffStatus from './DiffStatus'
import DiffView from './DiffView'

class DiffRow extends Component {
  render() {
    const diff = this.props.diff
    const rowClass = this.props.selected ? 'selected' : ''
    return (
      <Table.Row onClick={this.props.selectDiff} className={rowClass}>
        <Table.Cell><DiffStatus status={diff.status}/></Table.Cell>
        <Table.Cell><code>{diff.name}</code></Table.Cell>
        <Table.Cell>{diff.type}</Table.Cell>
        <Table.Cell>
          <a href={diff.builds[0].buildUrl}>{diff.builds[0].name}</a>
        </Table.Cell>
        <Table.Cell>
          <a href={diff.builds[0].fileUrl}>{diff.builds[0].filename}</a>
        </Table.Cell>
        <Table.Cell>
          <a href={diff.builds[1].buildUrl}>{diff.builds[1].name}</a>
        </Table.Cell>
        <Table.Cell>
          <a href={diff.builds[1].fileUrl}>{diff.builds[1].filename}</a>
        </Table.Cell>
      </Table.Row>
    )
  }
}

export default class DiffsTable extends Component {
  render() {
    let idx = 0
    let diffs = this.props.diffs || []
    if (diffs.length === 0) {
      return (
        <Alert border="shadow" type="info" title="Tips">
          <p>This searches through:</p>
          <List>
            <List.Item>IDs</List.Item>
            <List.Item>Names</List.Item>
            <List.Item>Filenames</List.Item>
            <List.Item>Build names</List.Item>
          </List>
        </Alert>
      )
    }
    return (
      <Table isHoverable isStriped isFullWidth>
        <Table.Head>
          <Table.Row>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Type</Table.HeadCell>
            <Table.HeadCell>Build A</Table.HeadCell>
            <Table.HeadCell>File A</Table.HeadCell>
            <Table.HeadCell>Build B</Table.HeadCell>
            <Table.HeadCell>File B</Table.HeadCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {diffs.map((diff) => (
            <DiffRow
              key={idx++}
              diff={diff}
              selected={null}
              selectDiff={()=>{}}
            />
          ))}
        </Table.Body>
      </Table>
    )
  }
}
