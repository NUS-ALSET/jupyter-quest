
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Modal from 'material-ui/Modal';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'
import StarIcon from 'material-ui-icons/Star'
import {UploadsQuestion} from './uploadingProblem'
import Notification from '../notification'


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
    maxHeight:'400px',
    overflowY:'scroll'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 400,
  },
  fab: {
    margin: theme.spacing.unit * 2,
  },
  input: {
    display: 'none',
  },
absolute: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 3,
  },
});

class AddQuestions extends React.Component {
    constructor(props){
        super(props)
  this.state = {
    password: '',
    name:'',
    pathId:'',
    isActive:false,
    open:false,
    title:null,
    problemRequired:false
  };
}
handleNotification = (msg) => {
  this.setState({ open: true,message:msg });
};
closeNotification = () => {
  this.setState({ open: false });
}

handleInput=(e)=>{
this.setState({[e.target.name]:e.target.value})
}
submitProblem=(formData)=>{
  if(formData.name && formData.uploadedProblem){
  let problemData = {problem:formData.name, file:formData.uploadedProblem}
  this.props.firebase.push(`/problems/${this.state.pathId}/`, problemData)
  .then( data => {
    // wait for db to send response\
    
    this.props.firebase.set(`/path/${this.state.pathId}/problems`,true)
  .then( data => {
    this.handleNotification('Problem Added Successfully');
  })
  this.setState({name:'', problemRequired:false})
  this.closeProblem()
  this.props.handleClose()
  }) 
  .catch( error => {console.error(error)} )
}
else{
this.setState({problemRequired:true})
}
}

createProblem=(id, pathTitle)=>{
  this.setState({isActive:true, pathId:id, title:pathTitle})
}
closeProblem=()=>{
  this.setState({isActive:false})
}


  render() {
    const { classes, openModel, handleClose, allPath, addpath} = this.props;
    const {message, open, problemRequired} = this.state
    return (
      <div>
         <Notification message={message} open={open} handleClose={this.closeNotification}/>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={openModel}
          onClose={()=>handleClose()}
        >
          <div style={getModalStyle()} className={classes.paper}>
            <Typography type="title" id="modal-title">
            <div className={classes.container} >
            <h2>Create Question</h2>
            <div>
            <List>
      {allPath ? <div>{ allPath.map((path,index)=>(
        <List key={path.key}>
        <ListItem key={index} button>
        <ListItemIcon>
        <StarIcon />
        </ListItemIcon>
        <ListItemText onClick={()=>this.createProblem(path.key, path.value.title)} primary={path.value.title} />
      </ListItem>
          </List>
    //  <ListItem key={index} button>
      //   <ListItemIcon>
      //   <StarIcon />
      //   </ListItemIcon>
      //   <ListItemText onClick={()=>this.createProblem(path.key, path.value.title)} primary={path.value.title} />
      // </ListItem>
      ))} </div> :''}
      <ListItem button>
        <ListItemIcon>
          <AddIcon />
        </ListItemIcon>
        <ListItemText primary="Add Path" onClick={ () => addpath()} />
      </ListItem>
      </List>
      <br />
    </div>
        </div><br/>
            </Typography>
            <Typography type="subheading" id="simple-modal-description">
              <Button className="cancelBtn" 
              raised color="default" onClick={ () => {handleClose() }}>OKAY</Button>
            </Typography>
          </div>
        </Modal>
        <UploadsQuestion openFile={this.state.isActive}
         handleCloseFile={this.closeProblem}
          handleInput={(e)=>this.handleInput(e)} 
          handleSubmitFile={this.submitProblem}
          name={this.state.name}
          problemRequired={problemRequired}
          />
      </div>
    );
  }
}

AddQuestions.propTypes = {
  classes: PropTypes.object.isRequired,
  openModel: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};

export const AddQuestion = withStyles(styles)(AddQuestions);
