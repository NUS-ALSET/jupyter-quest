import React from 'react'
import Collapse from 'material-ui/transitions/Collapse';
import List, { ListItem, ListItemText } from 'material-ui/List'
import { firebaseConnect } from 'react-redux-firebase';
import { connect } from 'react-redux';
import { compose } from 'redux';

const ProblemComponent = (props) => {
    const {active, problems, pathId} = props;
    let AllProblems = problems ? problems[pathId] : null;
    return (
    <Collapse in={active} timeout="auto" unmountOnExit>
     {AllProblems && AllProblems.map( problem =>   <List key={problem.key} component="div" disablePadding>
        <ListItem button>
        <ListItemText inset primary={problem.value.problem} />
        </ListItem>
    </List>
    )} 
    
  </Collapse>
)}

export const Problem = compose(
    firebaseConnect((props,store)=>[
        {path:`problems/${props.pathId}/`}
    ]),
    connect( ({firebase}) => ( { problems: firebase.ordered.problems } ) )
)(ProblemComponent);
