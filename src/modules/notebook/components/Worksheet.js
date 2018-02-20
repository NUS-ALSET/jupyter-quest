import React, { Component } from 'react'
import PropTypes from 'prop-types';
import Cell from './Cell'

class Worksheet extends Component {
  static propTypes = {
    raw: PropTypes.object.isRequired,
    metadata: PropTypes.object.isRequired,
    showCode: PropTypes.bool
  }

  render() {
    const { raw, metadata, showCode } = this.props

    const cells = raw.cells.map((c, i) => {
      return <Cell raw={c} key={`cell${i}`} showCode={showCode} metadata={metadata}/>
    });

    return (
      <div className="worksheet">
        {cells}
      </div>
    )
  }
}

export default Worksheet
