import React, { Component } from 'react'
import { styled, Box, Flex, Heading } from 'fannypack'

import AddDialog from './AddDialog'

const Diffs = () => (
  <Flex justifyContent="space-between" flexDirection="row">
    <Box><Heading>Diff Generator</Heading></Box>
    <Box><AddDialog/></Box>
  </Flex>
)

export default Diffs
