import React, { Component } from 'react'
import { Query } from "react-apollo"
import gql from "graphql-tag"

import DiffsTable from './DiffsTable'

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
      return <DiffsTable diffs={data.diffs}/>
    }}
  </Query>
)

export default Diffs
