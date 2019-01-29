import React, { Component } from 'react'
import { Table } from 'fannypack'
import { Query } from "react-apollo"
import gql from "graphql-tag"

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

const Diffs = () => (
  <Query
    query={gql`
      {
        diffs {
          name
          type
          status
          builds {
            name
            type
            fileUrl
            buildUrl
          }
        }
      }
    `}
  >
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>
      if (error)   return <p>Error :(</p>
      let idx = 0
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
    }}
  </Query>
)

export default Diffs
