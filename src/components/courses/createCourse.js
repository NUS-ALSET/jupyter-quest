import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Modal from 'material-ui/Modal';
import Button from 'material-ui/Button';
import { FormHelperText, FormControl } from 'material-ui/Form';
import TextField from 'material-ui/TextField';

function getModalStyle() {
  const top = '50';
  const left = '50';

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
});

class SimpleModal extends React.Component {
    constructor(props){
        super(props)
  this.state = {
    password: '',
    name:''
  };
}

  render() {
    const { classes, openModel, handleClose, handleSubmit, name, password, handleInput, nameRequired, pwdRequired } = this.props;
    return (
      <div>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={openModel}
          onClose={()=>handleClose()}
        >
          <div style={getModalStyle()} className={classes.paper}>
            <Typography type="title" id="modal-title">
            <div className={classes.container} >
            <h2>Create Course</h2>

            Name
            <div>
            <FormControl>
                <TextField type="text"
                    className={classes.textField}
                    name="name" value={name}
                    onChange={(e) => {handleInput(e)}}
                    />
               { nameRequired && <FormHelperText className="error-text">Name Required</FormHelperText>}
                </FormControl>
            </div>
              Password
            <div>
            <FormControl>
                <TextField type="password"
                    className={classes.textField}
                    name="password" value={password}
                    onChange={(e) => {handleInput(e)}}/>
               { pwdRequired && <FormHelperText className="error-text">Password Required</FormHelperText>}
                </FormControl>
            </div>
        </div><br/>
            </Typography>
            <Typography type="subheading" id="simple-modal-description">
            <Button raised color="primary" type="submit" onClick={() =>{handleSubmit({ name, password })}} >Submit</Button>
              <Button className="cancelBtn" 
              raised color="default" onClick={ () => {handleClose() }}>Cancel</Button>
            </Typography>
          </div>
        </Modal>
      </div>
    );
  }
}

SimpleModal.propTypes = {
  classes: PropTypes.object.isRequired,
  openModel: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  handleInput: PropTypes.func.isRequired
};

// We need an intermediary variable for handling the recursive nesting.
export const CreateCourse = withStyles(styles)(SimpleModal);
