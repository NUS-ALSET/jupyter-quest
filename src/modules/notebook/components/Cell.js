import React, { Component } from 'react'
import PropTypes from 'prop-types';
import Markdown from './Markdown'
import Output from './Output'
import Input from './Input'


const joinText = text => {
  if (text.join) {
      return text.map(joinText).join("")
  } else {
      return text
  }
}

// const coalesceStreams = outputs => {
//   if (!outputs.length) { return outputs }
//   var last = outputs[0]
//   var new_outputs = [ last ]
//   outputs.slice(1).forEach(function (o) {
//     if (o.raw.output_type === "stream" &&
//       last.raw.output_type === "stream" &&
//       o.raw.stream === last.raw.stream) {
//       last.raw.text = last.raw.text.concat(o.raw.text)
//     } else {
//       new_outputs.push(o)
//       last = o
//     }
//   })
//   return new_outputs
// }


class Cell extends Component {
  static propTypes = {
    raw: PropTypes.object.isRequired,
    metadata: PropTypes.object.isRequired,
    showCode: PropTypes.bool
  }

  render() {
    const { raw, metadata, showCode } = this.props

    if (raw.cell_type === "code") {
        let number = raw.prompt_number > -1 ? raw.prompt_number : raw.execution_count
        number = number || raw.execution_count
        const source = raw.input || [ raw.source ]

        const language = raw.language || metadata.language || (metadata.language_info && metadata.language_info.name)

        const input = <Input showCode={showCode} raw={source} language={language} number={number}/>
        const outputs = (raw.outputs || []).map((o, i) => {
            return <Output showCode={showCode} raw={o} number={number} key={`output${i}`}/>
        })
        // const outputs = coalesceStreams(raw_outputs)
        return (
          <div className="cell code-cell">
            {input}
            {outputs}
          </div>
        )
    }

    if (raw.cell_type === "markdown") {
      return <Markdown
        className="cell markdown-cell"
        string={joinText(raw.source)}
      />
    }

    if (raw.cell_type === "heading") {
      // TODO: make raw.level impact the heading size
      return <h1 className="cell heading-cell">
        {joinText(raw.source)}
      </h1>
    }

    if (raw.cell_type === "raw") {
      return <h1 className="cell raw-cell">
        {joinText(raw.source)}
      </h1>
    }

  }
}

export default Cell
