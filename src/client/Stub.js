import React, { Component } from 'react'
import { styled, Box } from 'fannypack'

import randomColor from './randomColor'

let counter = 0

const StubBox = styled(Box)`
  border: solid black 1px;
  height: 100%;
  width: 100%;
`

export default class Stub extends Component {
  constructor (props) {
    super(props)
    this.color = randomColor(counter++)
  }
  
  render() {
    return <StubBox style={{backgroundColor: this.color}}></StubBox>
  }
}
