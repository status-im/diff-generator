import React, { PureComponent } from 'react'
import { styled, Spinner, Block, Input } from 'fannypack'

import Results from './Results'

export default class Search extends PureComponent {
  constructor (props) {
    super(props)
    this.state = { search: '', selected: 0 }
    /* ref for accessing diffs */
    this.results = React.createRef()
    /* bind methods */
    this.setSearch = this.setSearch.bind(this)
    this.setViewed = this.setViewed.bind(this)
    this.moveSelected = this.moveSelected.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  setSearch (search) {
    this.setState({search})
  }

  moveSelected (val) {
    let selected = this.state.selected + val
    this.setState({selected})
  }

  setViewed() {
    const diff = this.results.current
      .getWrappedInstance()
      .getDiffName(this.state.selected)
    this.props.setViewed(diff)
  }

  handleKeyDown (e) {
    switch (e.keyCode) {
      case 38: this.moveSelected(-1) /* up */
      case 40: this.moveSelected(1)  /* down */
      case 39: this.setViewed() /* right */
      case 13: this.setViewed() /* enter */
    }
  }

  render() {
    const { search, selected } = this.state
    console.log('search:', search)
    return (
      <Block>
        <Input
          isFullWidth autoFocus
          onKeyDown={this.handleKeyDown}
          onChange={e => this.setSearch(e.target.value)}
          value={search}
        />
        <Results
          ref={this.results}
          search={`%${search}%`}
          selected={selected}
        />
      </Block>
    )
  }
}
