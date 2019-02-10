import React, { Component } from 'react'
import { Table, Alert, List } from 'fannypack'

import DiffRow from './DiffRow'

export default class DiffsTable extends Component {
  render() {
    let { selected, diffs } = this.props
    let idx = 0
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
      <Table isFullWidth>
        <Table.Head>
          <Table.Row>
            <Table.HeadCell>Status</Table.HeadCell>
            {/*<Table.HeadCell>Name</Table.HeadCell>*/}
            {/*<Table.HeadCell>Type</Table.HeadCell>*/}
            <Table.HeadCell>Build</Table.HeadCell>
            <Table.HeadCell>File</Table.HeadCell>
          </Table.Row>
        </Table.Head>
        {(diffs || []).map((diff) => (
          <DiffRow
            key={idx++}
            diff={diff}
            selected={selected%diffs.length==idx-1}
            selectDiff={this.props.setViewed.bind(diff.name)}
          />
        ))}
      </Table>
    )
  }
}
