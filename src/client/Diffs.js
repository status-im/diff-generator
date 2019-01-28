import React, { Component } from 'react';
import { Query } from "react-apollo";
import gql from "graphql-tag";

class DiffRow extends Component {
  render() {
    const diff = this.props.diff
    return (
      <tr>
        <td><code>{diff.name}</code></td>
        <td>{diff.type}</td>
        <td>{diff.status}</td>
        <td><b>{diff.builds[0].name}</b></td>
        <td><b>{diff.builds[1].name}</b></td>
      </tr>
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
      if (loading) return <p>Loading...</p>;
      if (error)   return <p>Error :(</p>;
      let idx = 0;
      return (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Status</th>
              <th>Build A</th>
              <th>Build B</th>
            </tr>
          </thead>
          <tbody>
            {data.diffs.map((diff) => (
              <DiffRow key={idx++} diff={diff} />
            ))}
          </tbody>
        </table>
      );
    }}
  </Query>
);

export default Diffs;
