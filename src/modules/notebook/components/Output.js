import React, { Component } from 'react'
import PropTypes from 'prop-types';
import ansi_up from 'ansi_up'
import DisplayData from './DisplayData'
import DisplayError from './DisplayError'
import Code from './Code'

const joinText = text => {
  if (text.join) {
      return text.map(joinText).join("")
  } else {
      return text
  }
}


class Output extends Component {
  static propTypes = {
    number: PropTypes.number,
    showCode: PropTypes.bool
  }

  render() {
    const { raw, number, showCode } = this.props
    let output;

    if (['display_data', 'execute_result', 'pyout'].includes(raw.output_type)) {
      output = <DisplayData raw={raw} number={number} />
    }

    if (['error', 'pyerr'].includes(raw.output_type)) {
      output = <DisplayError raw={raw} number={number} />
    }

    if (raw.output_type === 'stream') {
      const text = joinText(raw.text)
      output = (
        <Code
          showCode={showCode}
          className={(raw.stream || raw.name)}
          string={ansi_up.ansi_to_html(text)}
        />
      )
    }

    return (
      <div className="output" data-prompt-number={number || null}>
        {output}
      </div>
    )
  }
}

export default Output
