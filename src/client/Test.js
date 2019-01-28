import React from 'react';
import { Query } from "react-apollo";
import gql from "graphql-tag";

const Test = () => (
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
      if (error) return <p>Error :(</p>;
      console.dir(data)
      return data.diffs.map(({ name, type, status, builds }) => (
        <div key={name}>
          <p>{name}</p>
          <p>{type}</p>
          <p>{status}</p>
        </div>
      ));
    }}
  </Query>
);

export default Test;
