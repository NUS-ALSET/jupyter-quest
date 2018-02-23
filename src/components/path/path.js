
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AppFrame from '../../AppFrame'
import Button from 'material-ui/Button/Button';
import {AddQuestion} from './addQuestion'
import List, { ListItem, ListItemText } from 'material-ui/List'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import withStyles from 'material-ui/styles/withStyles';
import ExpandLess from 'material-ui-icons/ExpandLess';
import ExpandMore from 'material-ui-icons/ExpandMore';
import CreatePath from './createPath';

// components
import {Problem} from './'

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  control: {
    padding: theme.spacing.unit * 2,
  },
});

class Path extends Component {
  constructor(props) {
    super(props)
    this.state={
      isActive:false,
      spacing: '16',
      open: -1,
      selected: null,
      createPath: false
    }
  }

  handleClick = (e,index, pathId) => {
    this.props.firebase.watchEvent('value',`/problems/${pathId}/`)
    if(this.state.open===index){
      this.setState({open : -1});
    }else{
      this.setState({open : index})
    }
    this.setState({selected:pathId})
  };
  createQuestion=()=>{
    this.setState({isActive:true})
  }
  closeQuestion=()=>{
    this.setState({isActive:false})
  }
  enableCreatePath=()=>{
    this.setState({createPath:true})
  }
  createPath(){
  }
  submitPath=(path)=>{
    let pathData = {
        title: path,
        owner:this.props.auth.uid
    }
    this.props.firebase.push(`path`, pathData).then( data => {
      this.setState({createPath:false, isActive: false})
        // wait for db to send response\
  
      //this.handleNotification('Path Added Successfully');
      //this.setState({path:'',pathAdded:true})
      }) ;  
}
cancelPath=()=>{
  this.setState({createPath:false, isActive: false})
}

  render() {
    const {isActive, spacing, open, selected} = this.state
    const {path, classes, firebase} = this.props;

    let comp = null;
    if(this.state.createPath){
      comp = <Grid container className={classes.demo} justify="flex-start" spacing={Number(spacing)}>
      <CreatePath submitPath={this.submitPath} cancelPath={this.cancelPath}  /></Grid>
    
    } else{
      comp =
        <div>
        <Grid container className={classes.demo} justify="flex-start" spacing={Number(spacing)}>
          <Paper className='comp-height' >
        <h3>Public Path</h3> 
       <List>
         {path ? path.map( (pathItem, index) => 
         <div key={index}>
         <ListItem button onClick={(e)=>this.handleClick(e,index, pathItem.key)}>
           <ListItemText primary={pathItem.value.title} />
           {pathItem.value.problems && <div>{open===index ? <ExpandLess /> : <ExpandMore />}</div>}
           
         </ListItem>
         
         {selected === pathItem.key &&  <Problem pathId={pathItem.key}  active={open === index}  /> }
          
         </div>
       ) : <h5>No Data</h5>}
       </List>
       
     </Paper>
      <AddQuestion
          openModel={isActive} 
          handleClose={this.closeQuestion} 
          allPath={this.props.path}
          addpath={this.enableCreatePath}
          firebase={firebase}
        />
        </Grid>
        <Button style={{marginLeft:'5px', marginTop:'15px'}} raised color="primary" onClick={this.createQuestion}>Add Question</Button>
        </div>
      
    }


    return (
      <div>
        <AppFrame>
        <Grid item xs={12}>
        {comp}
        </Grid>
        </AppFrame>
      </div>
    )
  }
}

Path.propTypes = {

}
const PathWithFirebase = compose(
  firebaseConnect( (props, store) => 
  {
  const uid=store.getState().firebase.auth.uid;
 return [
    {
      path:`path`,
      queryParams:  [ 'orderByChild=owner', `equalTo=${uid}` ]
    }
  ]
  }),
  connect( ({firebase}) => ({path: firebase.ordered.path, auth: firebase.auth, }) )
)(Path)

Path.propTypes={
   path:PropTypes.array,
   classes:PropTypes.object.isRequired,
   firebase:PropTypes.object.isRequired
}

export const Paths =  withStyles(styles)(PathWithFirebase)