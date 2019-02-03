import React, { PureComponent } from 'react'
import { Input } from 'fannypack'

export default class Search extends PureComponent {
  constructor (props) {
    super(props)
    console.log('CONST!')
    this.state = { search: '' }
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.setSearch = this.setSearch.bind(this)
  }

  setSearch (e) {
    const search = e.target.value
    console.log(search)
    this.setState({search})
    this.props.setSearch(search)
  }

  handleKeyDown (e) {
    switch (e.keyCode) {
      case 38: this.props.moveSelected(-1) /* up */
      case 40: this.props.moveSelected(1)  /* down */
      case 39: this.props.setViewed(-1) /* right */
    }
  }

  render() {
    console.log('render!')
    console.log(this.state)
    return (
      <Input
        isFullWidth autoFocus
        onKeyDown={this.handleKeyDown}
        onChange={e => this.setSearch(e)}
        value={this.state.search}
      />
    )
  }
}
