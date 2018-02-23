import React from 'react'
import PropTypes from 'prop-types';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'
import Jupyter from './components'

const Notebook =({pathId,notebookProblems})=>{
return(
  <div>
      {notebookProblems && notebookProblems.map((problems,index)=>{
        return <Jupyter key={index}
        notebook={problems.value.file}
        showCode={true}
        defaultStyle={true}
        loadMathjax={true} 
      />
      })}
      
  </div>
)}

export default compose(
  firebaseConnect( (props, store) => [
      {
        path: `problems/${props.pathId}`,
        storeAs:'notebookProblems'
      },
    ]),
  connect(({ firebase }, props) => ({ 
    notebookProblems: firebase.ordered.notebookProblems
  }))
)(Notebook)

Notebook.propTypes={
  pathId:PropTypes.string.isRequired,
  notebookProblems:PropTypes.array
}


