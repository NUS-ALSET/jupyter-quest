import React from 'react'
import AppFrame from '../../AppFrame'
import Jupyter from './components'
import notebookJSON from './notebook-json-data'

const Notebook =()=>(
  <AppFrame pageTitle="Notebook" >
      <Jupyter
      notebook={notebookJSON}
      showCode={true}
      defaultStyle={true}
      loadMathjax={true} 
    />
  </AppFrame>
)
export default Notebook