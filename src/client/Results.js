import React, { PureComponent } from 'react'
import { Query, graphql } from 'react-apollo'
import gql from 'graphql-tag'
import { styled, Spinner, Block } from 'fannypack'

import DiffsTable from './DiffsTable'

const diffsQuery = gql`
  query Dog($search: String!) {
    diffs(
      nameLike: $search,
      orderByDesc: id,
      limit: 6
    ) {
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
`

class Results extends PureComponent {
  getDiffName(idx) {
    const diff = this.props.data.diffs[idx]
    if (diff) { return diff.name }
    return null
  }
  
  render() {
    const { loading, error, diffs } = this.props.data
    if (loading) return <Block><p>Loading...</p></Block>;
    if (error)   return <Block><p>Error</p></Block>;
    return (
      <DiffsTable selected={this.props.selected} diffs={diffs}/>
    )
  }
}

export default graphql(diffsQuery, {withRef: true})(Results)
