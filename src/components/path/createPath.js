
import React from 'react'
import { Redirect } from 'react-router-dom';
import Typography from 'material-ui/Typography';
import { FormHelperText, FormControl } from 'material-ui/Form';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'

import Notification from '../notification'


 class AddPaths extends React.Component{
    constructor(){
        super()
        this.state={
            path:'',
            open: false,
            message:null,
            pathAdded:false,
            errorPath : false
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
    handleValidation=(path)=>{
        if(path){
            this.props.submitPath(path);
            this.setState({errorPath:false});
        }else{
            this.setState({errorPath:true});
        }
    }
    render(){
        const {path, message, open, pathAdded,errorPath} = this.state
        const {auth, submitPath, cancelPath} = this.props
return (
    <div>
        <Notification message={message} open={open} handleClose={this.closeNotification}/>
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
         {errorPath &&  <FormHelperText className="error-text"> Path Name Required</FormHelperText>}
                     </FormControl>
        </div>
        <div>
            <br/>
            <Typography type="subheading" id="simple-modal-description">
            <Button raised color="primary" onClick={() =>this.handleValidation(path)} >Submit</Button>
            <Button raised style={{marginLeft:'5px'}} color="default" onClick={() =>cancelPath()} >Cancel</Button>
            </Typography>
        </div>
    </div>
    )
}
}

const AddPath = compose(
    firebaseConnect( (props, store) =>{
        const uid=store.getState().firebase.auth.uid;
        return [
            {
                path:'path',
                queryParams:  [ 'orderByChild=owner', `equalTo=${uid}` ]
            }      
        ] 
    }),
    connect( ({firebase}) => ({ auth: firebase.auth}) )
  )(AddPaths)

  export default AddPath