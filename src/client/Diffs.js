import React, { Component } from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

import Viewer from './Viewer'

const Diffs = () => (
  <Query
    query={gql`
      {
        diffs(orderByDesc: id, limit: 6) {
          name
          type
          status
          created
          builds {
            name
            type
            filename
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
      return (
        <Viewer diffs={data.diffs}/>
      )
    }}
  </Query>
)

export default Diffs
