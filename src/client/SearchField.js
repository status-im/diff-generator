import React, { PureComponent } from 'react'
import { Input } from 'fannypack'

export default class Search extends PureComponent {
  constructor (props) {
    super(props)
  }

  setSearch (e) {
    const search = e.target.value
    this.props.setSearch(search)
  }

  render() {
    return (
    )
  }
}
