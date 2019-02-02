import React, { Component } from 'react'
import { styled, Spinner, Block, Input } from 'fannypack'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

import DiffsTable from './DiffsTable'

const QUERY = gql`
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

export default class Search extends Component {
  constructor (props) {
    super(props)
    this.state = { search: '' }
    this.setSearch = this.setSearch.bind(this)
  }

  setSearch(search) {
    this.setState({search})
  }

  render() {
    return (
      <Block>
        <Input
          isFullWidth autoFocus
          onChange={e => this.setSearch(e.target.value)}
          value={this.state.search}
        />
        <Query query={QUERY} variables={{search: `%${this.state.search}%`}}>
          {({ loading, error, data }) => {
            if (loading) return <Spinner size="large" marginLeft="major-1" />;
            if (error)   return <Block><p>Error</p></Block>
            return (
              <DiffsTable diffs={data.diffs}/>
            )
          }}
        </Query>
      </Block>
    )
  }
}
