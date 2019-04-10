import React, { Component } from 'react'
import isUrl from 'is-url'
import { styled, Box, Text, Button, Divider, Input, Modal, DialogModal } from 'fannypack'

export default class AddDialog extends Component {
  constructor (props) {
    super(props)
    this.state = {
      footer: null,
      east: { value: null, color: null },
      west: { value: null, color: null },
    }
    this.onSubmit = this.onSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
  }

  handleKeyUp(event) {
    switch (event.keyCode) {
      case 13: /* enter */
        this.onSubmit(); break;
    }
  }

  notUrlWarning () {
    this.setState({footer: <Text color="danger">Values must be valid URLs!</Text>})
  }

  onChange (event) {
    let val = {
      value: event.target.value,
      color: 'success',
    }
    if (!isUrl(event.target.value)) {
      val['color'] = 'danger'
      this.notUrlWarning()
    }
    this.setState({[event.target.name]: val})
  }

  onSubmit () {
    fetch('/api/diffs/manual', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        east: this.state.east.value,
        west: this.state.west.value,
      }),
    })
  }

  render () {
    return (
      <Modal.Container>
        {modal => (
          <Box>
            <Button
              use={Modal.Show} {...modal}
            >
              Create Diff
            </Button>
            <DialogModal
              type="info"
              slide={true}
              showActionButtons
              showCloseButton
              actionButtonsProps={{
                disabled: (this.state.footer !== null),
                onClickSubmit: this.onSubmit,
              }}
              title="Create a new Diff"
              footer={this.state.footer}
              {...modal}
            >
              <p>Provide two file URLs to compare</p>
              <Input
                style={{width: "100%"}}
                type="url" name="east"
                placeholder="First file URL"
                state={this.state.east.color}
                onKeyUp={this.handleKeyUp}
                onChange={this.onChange}
              />
              <Divider content="vs"/>
              <Input
                type="url" name="west"
                placeholder="Second file URL"
                state={this.state.west.color}
                onKeyUp={this.handleKeyUp}
                onChange={this.onChange}
              />
            </DialogModal>
          </Box>
        )}
      </Modal.Container>
    )
  }
}
