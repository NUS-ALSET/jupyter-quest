import React from 'react'
import PropTypes from 'prop-types';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'
import Jupyter from './components'

const Notebook =({assignment,notebookProblem})=>{
const  jsonParseData=notebookProblem ? JSON.parse(notebookProblem.file) : null;

return(
  <div>
      {jsonParseData && 
       <div>
       <h1>Problem : {notebookProblem.problem}</h1>
       <hr/>
       <Jupyter
        notebook={jsonParseData}
        showCode={true}
        defaultStyle={true}
        loadMathjax={true} 
      />
      </div>
      }
      
  </div>
)}

export default compose(
  firebaseConnect( (props, store) => [
      {
        path: `problems/${props.assignment.value.path}/${props.assignment.value.problem}`,
        storeAs:'notebookProblem'
      },
    ]),
  connect(({ firebase }, props) => ({ 
    notebookProblem: firebase.data.notebookProblem
  }))
)(Notebook)

Notebook.propTypes={
  assignment:PropTypes.object.isRequired,
  notebookProblem:PropTypes.object
}


