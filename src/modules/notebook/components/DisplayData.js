import React, { Component } from 'react'
import Code from './Code'
import Markdown from './Markdown'


const joinText = text => {
  if (text.join) {
      return text.map(joinText).join("")
  } else {
      return text
  }
}


const display_priority = [
    "png", "image/png", "jpeg", "image/jpeg",
    "svg", "text/svg+xml", "html", "text/html",
    "text/markdown", "latex", "text/latex",
    "javascript", "application/javascript",
    "text", "text/plain"
]


class DisplayData extends Component {
  render() {
    const { raw } = this.props
    const formats = display_priority.filter(function (d) {
        return raw.data ? raw.data[d] : raw[d]
    })
    const format = formats[0]

    if (!format) {
      return <div className="empty-output"></div>
    }

    const data = raw[format] || raw.data[format]

    if (['text', 'text/plain'].includes(format)) {
      return (
        <Code
          className="text-output"
          string={joinText(data)}
        />
      )
    }

    if (['javascript', 'application/javascript'].includes(format)) {
      return <script
        dangerouslySetInnerHTML={{__html: data}}
        ></script>
    }

    if (['latex', 'text/latex'].includes(format)) {
      return <div className="latex-output">{data}</div>
    }

    if (['text/markdown'].includes(format)) {
      return <Markdown
        className="html-output"
        string={joinText(data)}
      />
    }

    if (['html', 'text/html'].includes(format)) {
      return <div
        className="html-output"
        dangerouslySetInnerHTML={{__html: joinText(data)}}
      ></div>
    }

    if (['svg', 'text/svg+xml'].includes(format)) {
      return <div className="svg-output">
        {joinText(data)}
      </div>
    }

    if (['jpeg', 'image/jpeg'].includes(format)) {
      return <img alt="cell-output" className="image-output"
        src={"data:image/jpeg;base64," + joinText(data).replace(/\n/g, "")}
      />
    }

    if (['png', 'image/png'].includes(format)) {
      return <img alt="cell-output" className="image-output"
        src={"data:image/png;base64," + joinText(data).replace(/\n/g, "")}
      />
    }

    return <div>not implemented</div>
  }
}

export default DisplayData
