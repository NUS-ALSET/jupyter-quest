
import React from 'react'
import Typography from 'material-ui/Typography';
import { FormControl } from 'material-ui/Form';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'
import AppFrame from '../../AppFrame'
import Notification from '../notification'
import { Redirect } from 'react-router-dom';


 class AddPaths extends React.Component{
    constructor(){
        super()
        this.state={
            path:'',
            open: false,
            message:null,
            pathAdded:false
        }
    }                                           
    handleInput=(e)=>{
        this.setState({[e.target.name]:e.target.value})
    }
    handleNotification = (msg) => {
        this.setState({ open: true,message:msg });
    };
    closeNotification = () => {
        this.setState({ open: false });
    };

    render(){
        const {path, message, open, pathAdded} = this.state
        const {auth, submitPath, cancelPath} = this.props
return (
    <div>
        <Notification message={message} open={open} handleClose={this.closeNotification}/>
        <AppFrame>
        <h2>Create Path</h2>
        Path name
        <div>
        <FormControl>
            <TextField type="text"
                className="pathStyle"
                name="path" 
                value={path}
                onChange={this.handleInput}
                />
           {/* <FormHelperText className="error-text">Name Required</FormHelperText> */}
            </FormControl>
        </div>
        <div>
            <br/>
            <Typography type="subheading" id="simple-modal-description">
            <Button raised color="primary" onClick={() =>submitPath(this.state.path)} >Submit</Button>
            <Button raised style={{marginLeft:'5px'}} color="default" onClick={() =>cancelPath()} >Cancel</Button>
            </Typography>
        </div>
        </AppFrame>
    </div>
    )
}
}

const AddPath = compose(
    firebaseConnect( (props, store) => [
        {
            path:'path',
        }      
    ] ),
    connect( ({firebase}) => ({ auth: firebase.auth}) )
  )(AddPaths)

  export default AddPath