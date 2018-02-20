import React, { Component } from 'react'
import PropTypes from 'prop-types';
import Code from './Code'


const joinText = text => {
  if (text.join) {
      return text.map(joinText).join("")
  } else {
      return text
  }
}


class Input extends Component {
  static propTypes = {
    number: PropTypes.number,
    language: PropTypes.string,
    showCode: PropTypes.bool
  }

  render() {
    const { raw, number, language, showCode } = this.props

    if (!raw.length) return <div></div>

    return (
      <div className="input" data-prompt-number={number || null}>

        <Code
          showCode={showCode}
          className={`language-${language}`}
          string={joinText(raw)}
          language={language}
        />
      </div>
    )
  }
}

export default Input
