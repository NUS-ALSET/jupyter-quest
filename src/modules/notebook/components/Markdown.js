import React, { Component } from 'react'
import PropTypes from 'prop-types';
import markdownIt from 'markdown-it'
import markdownMathjax from 'markdown-it-mathjax'

const markdown = markdownIt({
  linkify: true,
  html: true,
}).use(markdownMathjax())


class Markdown extends Component {
  static propTypes = {
    className: PropTypes.string,
    string: PropTypes.string.isRequired,
  }

  typeset() {
    if (window.MathJax) {
      window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub])
    }
  }

  componentDidMount() {
    this.typeset()
  }

  componentDidUpdate() {
    this.typeset()
  }

  render() {
    const { string, className } = this.props

    return (
      <div
        className={className}
        dangerouslySetInnerHTML={{__html: markdown.render(string)}}
      />
    )
  }
}

export default Markdown
