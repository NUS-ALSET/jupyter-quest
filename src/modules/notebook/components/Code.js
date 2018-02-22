import React, { Component } from 'react'
import PropTypes from 'prop-types';
import highlight from 'highlight.js'
import 'highlight.js/styles/github.css'

class Code extends Component {
  static propTypes = {
    className: PropTypes.string,
    language: PropTypes.string,
    string: PropTypes.string.isRequired,
    showCode: PropTypes.bool
  }

  componentDidMount() {
    const { showCode } = this.props
    if (!showCode) return

    highlight.highlightBlock(this._elem)
  }

  componentDidUpdate() {
    const { showCode } = this.props
    if (!showCode) return

    highlight.initHighlighting.called = false
    highlight.highlightBlock(this._elem)
  }

  render() {
    const { string, className, language = '', showCode } = this.props

    if (!showCode) return <div></div>

    return (
      <pre className={className} data-language={language}>
        <code ref={c => {this._elem = c}}>
          {string}
        </code>
      </pre>
    )
  }
}

export default Code
