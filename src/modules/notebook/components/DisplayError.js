import React, { Component } from 'react'
import Code from './Code'
import ansi_up from 'ansi_up'

class DisplayError extends Component {
  render() {
    const { raw } = this.props
    const text =raw.traceback.join("\n")

    return <Code
        className="pyerr"
        string={ansi_up.ansi_to_html(text)}
      />
  }
}

export default DisplayError
