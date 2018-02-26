import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'
import Paper from 'material-ui/Paper';
import Tabs, { Tab } from 'material-ui/Tabs';

// components
import CreateAssignment from '../../createAssignment'
import Notification from '../../notification'
import AppFrame from '../../../AppFrame'
import {
  AssignmentList, 
  InstructorView, 
  EditAssignment} from '../../assignments/';
import Notebook from '../../../modules/notebook'

const columnDataForEditAssignment = [
  { id: 'Name', numeric: false, disablePadding: true, label: 'Name' },
  { id: 'Avisible', numeric: true, disablePadding: false, label: 'Assignment Visible' },
  { id: 'Sovisible', numeric: true, disablePadding: false, label: 'Solution Visible' },
  { id: 'AopenDt', numeric: true, disablePadding: false, label: 'Assignment Open Date' },
  { id: 'AoTime', numeric: true, disablePadding: false, label: 'Assignment Open Time' },
  { id: 'AcloseDt', numeric: true, disablePadding: false, label: 'Assignment Close Date' },
  { id: 'AcTime', numeric: true, disablePadding: false, label: 'Assignment Close Time' },
  { id: 'Detail', numeric: true, disablePadding: false, label: 'Details' },
  { id: 'Order', numeric: true, disablePadding: false, label: 'Order' }
];

let columnDataForAssignmentLists = [];
  // { id: 'desert', numeric: true, disablePadding: false, label: 'Student1' },
  // { id: 'team1Asignmt', numeric: true, disablePadding: false, label: 'Student2' },
  // { id: 'team1Name', numeric: true, disablePadding: false, label: 'Student3' },
  // { id: 'team2Asigmt', numeric: true, disablePadding: false, label: 'Student4' }


const columnDataForInstructorView = [
  { id: 'sDetail', numeric: false, disablePadding: true, label: 'Student blah detail' },
    { id: 'desert', numeric: true, disablePadding: false, label: 'Favorite Dessert blah detail' },
    { id: 'team1Asignmt', numeric: true, disablePadding: false, label: 'Assignment One blah detail' },
    { id: 'team1Name', numeric: true, disablePadding: false, label: 'Team Name blah detail' },
    { id: 'team2Asigmt', numeric: true, disablePadding: false, label: 'Assignment Two blah detail' },
    { id: 'team2Name', numeric: true, disablePadding: false, label: 'Team Name blah detail' }
  ];

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 800,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

class CourseDetails extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      order: 'asc',
      orderBy: 'calories',
      selected: [],
      data: null,
      page: 0,
      rowsPerPage: 5,
      isAsgmtActive:false,
      showTable:true,
      open: false,
      message:null,
      nameRequired: false,
      descRequired: false,
      textRequired: false,
      pathRequired: false,
      problemRequired : false,
      value: 0,
      isInstructor : false,
      selectedAssignment : null
    };
  }
  openNotebook=(assignment)=>{
    this.setState({selectedAssignment:assignment, value:1});
  }  

  closeAssignment=()=>{
    this.setState({isAsgmtActive:false, showTable:true})
  }
  handleNotification = (msg) =>{
    this.setState({ open: true,message:msg });
  };
  closeNotification = () => {
    this.setState({ open: false });
  };
 
  submitAssignment=(formData)=>{
   let newAssignment={
      name:formData.name,
      desc:formData.desc,
      assignmentVisibility:false,
      solutionVisibility:false
    }
    let error=false;
    if(formData.name === ''){
      this.setState({nameRequired:true});
      error=true;
    }else{
      this.setState({nameRequired:false});
    }
    if(formData.desc === ''){
      this.setState({descRequired:true});
      error=true;
    }else{
      this.setState({descRequired:false});
    }
    if(formData.type==='Notebook'){
      if(formData.path === ''){
        this.setState({pathRequired:true});
        error=true;
       
      }else{
        this.setState({pathRequired:false})
      }
      if(formData.problem === ''){
        this.setState({problemRequired:true})
        error=true;
       
      }else{
        this.setState({problemRequired:false})
      }
      newAssignment.path=formData.path;
      newAssignment.problem = formData.problem;
    }else{
      if(formData.text === ''){
        this.setState({textRequired:true})
        error=true;
       
      }else{
        this.setState({textRequired:false})
      }
      newAssignment.text=formData.text
    }
    if(error){
      return;
    }
    const ref=`assignments/${this.props.match.params.id}`;
    this.props.firebase.push(ref, newAssignment)
    .then( data => {
      // wait for db to send response
      this.handleNotification('Assignment Added Successfully');
      this.closeAssignment();
      this.setState({showTable:true})
    })
    .catch(e=>{
      console.log(e);
    })
  }

  createAssignment=()=>{
    this.setState({isAsgmtActive:true, showTable:false})
  }

  handleChange = (event, value) => {
    if(value===1){
      return;
    }
    this.setState({ value });
    if(value !==2){
      this.closeAssignment()
    }
  };

  render() {
    const { classes, assignment, auth, match, student,isInstructor, assignmentPath } = this.props;
    // get the array of assignments
    let assignments = assignment ? assignment[match.params.id] : [];
    const visibleAssignments=assignments.filter(assignment=>assignment.value.assignmentVisibility);
    const { open, message, showTable,nameRequired,descRequired,textRequired,pathRequired,problemRequired,selectedAssignment } = this.state;
     if(visibleAssignments){
      columnDataForAssignmentLists=[{ id: 0, numeric: false, disablePadding: true, label: 'Student Name'}]
      visibleAssignments.map((item,index) => {
       let data={id: ++index, numeric: false, disablePadding: true, label: item.value.name, detailsLink: item.value.desc};

       columnDataForAssignmentLists.push(data);
       return null;
    } )
   }  
    let activeTab = <h2>No Data</h2>;
    switch (this.state.value) {
      case 0 : {
        activeTab = assignments ? <AssignmentList  firebase={this.props.firebase} uid={match.params.id} 
        create={this.createAssignment} columnData={columnDataForAssignmentLists} auth = {auth} 
        showTable={showTable} studentList = {student} assignments={visibleAssignments} openNotebook={this.openNotebook}/> : <h2>No data</h2>;
        break;
      }
      case 1: {
        activeTab =<div>{selectedAssignment.value.path && selectedAssignment.value.problem && <Notebook assignment={selectedAssignment} />} </div>
        break;
      }
      case 2 : {
        activeTab =   <EditAssignment firebase={this.props.firebase} uid={match.params.id} 
        create={this.createAssignment} columnData={columnDataForEditAssignment}  
        data={assignments} showTable={showTable}/>
   
        break;
      }
      case 3: {
        activeTab = <InstructorView  firebase={this.props.firebase} uid={match.params.id} 
        create={this.createAssignment} columnData={columnDataForInstructorView}  
        data={assignments} showTable={showTable} openNotebook={this.openNotebook}/>
        break;
      }
   
      default : {
        break;
      }
    }

    return (
      <div>
        <AppFrame pageTitle="Assignments" >
            <Paper className={classes.root}>
              <Tabs
                value={this.state.value}
                onChange={this.handleChange}
                indicatorColor="primary"
                textColor="primary"
                centered
              >
                <Tab label="ASSIGNMENTS" />
                <Tab label="NOTEBOOK" />
               {isInstructor && <Tab label="EDIT" />}
               {isInstructor && <Tab label="INSTRUCTOR VIEW" />}
               
              </Tabs>         
              {activeTab}
            </Paper> 

          { this.state.isAsgmtActive && <CreateAssignment 
          handleClose={this.closeAssignment}
          handleSubmit={this.submitAssignment}
          nameRequired={nameRequired}
          descRequired={descRequired}
          textRequired={textRequired}
          pathRequired={pathRequired}
          problemRequired={problemRequired}
          pathRequired={pathRequired}
          assignmentPath={assignmentPath}
          /> }
        </AppFrame>
     
        <Notification message={message} open={open} handleClose={this.closeNotification}/>
      </div>
    );
  }
}

const AssignmentWithFirebase = compose(
  firebaseConnect( (props, store) => 
  {
    const uid=store.getState().firebase.auth.uid;
 return [
      {
        path: `assignments/${props.match.params.id}/`,
        queryParams:  props.assignmentQueryParams
      },
      {
        path:`courseMembers/${props.match.params.id}/`,
        storeAs:'student'
      },
      {  
      path:'path',
      storeAs:'assignmentPath',
      queryParams:  [ 'orderByChild=owner', `equalTo=${uid}` ]
      },
    ]
  }),
  connect(({ firebase }) => ({ 
    auth: firebase.auth, 
    assignment: firebase.ordered.assignments,
    student: firebase.ordered.student,
    assignmentPath: firebase.ordered.assignmentPath
  }))
)(CourseDetails)

CourseDetails.propTypes = {
  classes: PropTypes.object.isRequired,
  assignment: PropTypes.object,
  auth: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  firebase: PropTypes.object.isRequired,
};

export const CourseDetail = withStyles(styles)(AssignmentWithFirebase);