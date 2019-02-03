import React, { PureComponent } from 'react'
import { styled, Spinner, Block, Input } from 'fannypack'
import { Query, graphql } from 'react-apollo'
import gql from 'graphql-tag'

import SearchField from './SearchField'
import DiffsTable from './DiffsTable'

const SEARCH_QUERY = gql`
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

class Search extends PureComponent {
  constructor (props) {
    super(props)
    this.state = { selected: 0 }
    this.setSearch = this.setSearch.bind(this)
    this.select = this.moveSelected.bind(this)
  }

  setSearch (search) {
    this.props.data.refetch({search})
  }

  moveSelected (val) {
    let selected = this.state.selected + val
    if (seleted < 0) {
      this.setState({selected: 0})
    } else if (seleted > this.props.data.diffs.length) {
      this.setState({selected: 0})
    } else {
      this.setState({selected})
    }
  }

  render() {
    const { loading, error, diffs } = this.props.data
    if (loading) return <Spinner size="large" marginLeft="major-1" />;
    if (error)   return <Block><p>Error</p></Block>
    return (
      <Block>
        <SearchField
          moveSelected={this.moveSelected}
          setSearch={this.setSearch}
        />
        <DiffsTable
          selected={diffs[this.state.selected]}
          diffs={diffs}
        />
      </Block>
    )
  }
}

export default graphql(SEARCH_QUERY, {
  options: { variables: { search: '%' } }
})(Search)
