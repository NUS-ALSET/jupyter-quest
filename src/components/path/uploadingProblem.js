
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Modal from 'material-ui/Modal';
import Button from 'material-ui/Button';
import { Link } from 'react-router-dom';
import AddIcon from 'material-ui-icons/Add';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'
import StarIcon from 'material-ui-icons/Star'
import TextField from 'material-ui/TextField/TextField';
import readJson from '../../helpers/readJson.js';

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
  fab: {
    margin: theme.spacing.unit * 2,
  },
  absolute: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 3,
  },
  container: {
    display: 'inline-block',
    flexWrap: 'wrap',
  },
  input: {
    display: 'none',
  },
});

class UploadsQuestions extends React.Component {
  constructor(props){
    super(props)
    this.state = { 
      uploadedProblem:null    
    };
  }
  fileHandle = (e) => {
    readJson(e.target.files[0], (data) => {
      this.setState({"uploadedProblem":data});
    })
  }

  render() {
    const {uploadedProblem} = this.state;
    const { classes, openFile, handleCloseFile, name, handleInput, handleSubmitFile } = this.props;
    return (
      <div>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={openFile}
          onClose={()=>handleCloseFile()}
        >
          <div style={getModalStyle()} className={classes.paper}>
            <Typography type="title" id="modal-title">
            <div className={classes.container} >
            Problem name
        <div>
            <TextField type="text"
                className="pathStyle"
                name="name" 
                value={name}
                onChange={handleInput}
                />
           {/* <FormHelperText className="error-text">Name Required</FormHelperText> */}
        </div>
        </div><br/><br/>
            </Typography>
            <Typography type="subheading" id="simple-modal-description">
              <input
              accept=".json"
              className={classes.input}
              id="raised-button-file"
              type="file"
              onChange={this.fileHandle}
            />
            <br />
            <label style={{marginRight:'10px'}} htmlFor="raised-button-file">
              <Button raised component="span" color="default" className={classes.button}> Upload File </Button>
            </label>
            <Button className="cancelBtn" 
              raised color="primary" onClick={ () => {handleSubmitFile({name, uploadedProblem}) }}>Submit</Button>
              <Button className="cancelBtn" 
              raised color="default" onClick={()=> handleCloseFile() }>Cancel</Button>
            </Typography>
          </div>
        </Modal>
      </div>
    );
  }
}

UploadsQuestions.propTypes = {
  classes: PropTypes.object.isRequired,
  openFile: PropTypes.bool.isRequired,
  handleCloseFile: PropTypes.func.isRequired
};

// We need an intermediary variable for handling the recursive nesting.
export const UploadsQuestion = withStyles(styles)(UploadsQuestions);
