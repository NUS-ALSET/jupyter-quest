import React, { Component } from 'react'
import PropTypes from 'prop-types';
import Worksheet from './Worksheet'

class Notebook extends Component {
  static propTypes = {
    raw: PropTypes.object.isRequired,
    config: PropTypes.object,
    showCode: PropTypes.bool
  }

  render() {
    const { raw, showCode } = this.props

    const metadata = raw.metadata
    const _worksheets = raw.worksheets || [ { cells: raw.cells } ]
    const worksheets = _worksheets.map((ws, i) => {
      return <Worksheet raw={ws} showCode={showCode} key={`$worksheet{i}`} metadata={metadata}/>
    })

    return (
      <div className="notebook">
        {worksheets}
      </div>
    )
  }
}

export default Notebook
