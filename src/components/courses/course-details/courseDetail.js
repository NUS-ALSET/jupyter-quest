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
  import { User_Roles_Instructor } from '../../../app-constant';

const columnData = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Name' },
  { id: 'calories', numeric: true, disablePadding: false, label: 'Description' }
];

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
      value: 0,
      isInstructor : false
    };
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
      assignmentVisibility:true,
      solutionVisibility:true
    }
    if(formData.path){
      newAssignment.path=formData.path;
    }else{
      newAssignment.text=formData.text
    }
    if(formData.name === '' && formData.desc!=='' )
    this.setState({nameRequired:true, descRequired:false})
    if(formData.name !== '' && formData.desc==='' )
    this.setState({nameRequired:false, descRequired:true})
    if(formData.name === '' && formData.desc==='')
    this.setState({nameRequired:true, descRequired:true})
    if(formData.name !== '' && formData.desc !==''){
    this.setState({pwdRequired:false, nameRequired:false})
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
  }

  createAssignment=()=>{
    this.setState({isAsgmtActive:true, showTable:false})
  }

  handleChange = (event, value) => {
    this.setState({ value });
    if(value===0 || value===2){
    this.closeAssignment()
    }
  };

  render() {
    const { classes, assignment, auth, match, userType, student,isInstructor, assignmentPath } = this.props;
    // get the array of assignments
    let assignments = assignment ? assignment[match.params.id] : [];
    const { open, message, showTable,nameRequired,descRequired,textRequired,pathRequired  } = this.state;
     if(assignments){
      columnDataForAssignmentLists=[{ id: 0, numeric: false, disablePadding: true, label: 'Student Name'}]
      assignments.map((item,index) => {
       let data={id: ++index, numeric: false, disablePadding: true, label: item.value.name};
       let links=item.value.desc ? item.value.desc.match(/(https?:\/\/[^\s]+)/) : [];
       data.detailsLink=links ? links[0] : null;
       columnDataForAssignmentLists.push(data);
    })
   }
    let activeTab = <h2>No Data</h2>;
    switch (this.state.value) {
      case 0 : {
        activeTab = assignments ? <AssignmentList  firebase={this.props.firebase} uid={match.params.id} 
        create={this.createAssignment} columnData={columnDataForAssignmentLists} auth = {auth} 
        data={assignments} showTable={showTable} studentList = {student} assignments={assignments} /> : <h2>No data</h2>;
        break;
      }
      case 1 : {
        activeTab =   <EditAssignment firebase={this.props.firebase} uid={match.params.id} 
        create={this.createAssignment} columnData={columnDataForEditAssignment}  
        data={assignments} showTable={showTable}/>
   
        break;
      }
      case 2: {
        activeTab = <InstructorView  firebase={this.props.firebase} uid={match.params.id} 
        create={this.createAssignment} columnData={columnDataForInstructorView}  
        data={assignments} showTable={showTable}/>
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
            {isInstructor && 
              <Tabs
                value={this.state.value}
                onChange={this.handleChange}
                indicatorColor="primary"
                textColor="primary"
                centered
              >
                <Tab label="ASSIGNMENTS" />
                <Tab label="EDIT" />
                <Tab label="INSTRUCTOR VIEW" />
              </Tabs>
              }              
              {activeTab}
            </Paper> 

          { this.state.isAsgmtActive && <CreateAssignment 
          handleClose={this.closeAssignment}
          handleSubmit={this.submitAssignment}
          nameRequired={nameRequired}
          descRequired={descRequired}
          textRequired={textRequired}
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