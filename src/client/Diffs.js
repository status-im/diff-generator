import React, { Component } from 'react';
import { Query } from "react-apollo";
import gql from "graphql-tag";

class DiffRow extends Component {
  render() {
    return (
      <tr>
        <td>{this.props.diff.name}</td>
        <td>{this.props.diff.type}</td>
        <td>{this.props.diff.status}</td>
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
