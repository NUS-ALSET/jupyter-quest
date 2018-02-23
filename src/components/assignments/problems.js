
import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'

import { withStyles } from 'material-ui/styles';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Select from 'material-ui/Select';

const styles = theme => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    formControl: {
      margin: theme.spacing.unit,
      minWidth: 0,
      width:'100%',
    },
    selectEmpty: {
      marginTop: theme.spacing.unit * 2,
    },
  });
  

class PathProblems extends React.Component {

  render() {
    const {problems,classes,handleInput,problem,pathId,problemRequired}=this.props;
    return (
        <FormControl className={classes.formControl}>
        <InputLabel htmlFor="age-simple">Choose Problem</InputLabel>
        <Select
        value={problem}
        onChange={(e)=>handleInput(e)}
        input={<Input name="problem"/>}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {problems && problems.map((pathProblem,index)=>
        <MenuItem key={index} value={pathProblem.key}>{pathProblem.value.problem}</MenuItem>
        )}
      </Select>
        { problemRequired && <FormHelperText className="error-text">Problem Required</FormHelperText>}
       </FormControl>
    );
  }
}

export default withStyles(styles)(compose(
    firebaseConnect( (props, store) => [
        {
          path: `problems/${props.pathId}`,
          storeAs:'pathProblems'
        },
      ]),
    connect(({ firebase }, props) => ({ 
        problems: firebase.ordered.pathProblems
    }))
  )(PathProblems));


