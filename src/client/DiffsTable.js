import React, { Component } from 'react'
import { Table } from 'fannypack'

class DiffRow extends Component {
  render() {
    const diff = this.props.diff
    return (
      <Table.Row>
        <Table.Cell>{diff.status}</Table.Cell>
        <Table.Cell><code>{diff.name}</code></Table.Cell>
        <Table.Cell>{diff.type}</Table.Cell>
        <Table.Cell><b>{diff.builds[0].name}</b></Table.Cell>
        <Table.Cell><b>{diff.builds[1].name}</b></Table.Cell>
      </Table.Row>
    )
  }
}

class DiffsTable extends Component {
  render() {
    return (
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Name</Table.HeadCell>
            <Table.HeadCell>Type</Table.HeadCell>
            <Table.HeadCell>Build A</Table.HeadCell>
            <Table.HeadCell>Build B</Table.HeadCell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {data.diffs.map((diff) => (
            <DiffRow key={idx++} diff={diff} />
          ))}
        </Table.Body>
      </Table>
    )
  }
}

export default DiffsTable
