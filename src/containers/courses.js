import React from 'react'
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import { firebaseConnect } from 'react-redux-firebase'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import AppFrame from '../AppFrame'
import CourseTable from '../components/courses';
import Modal from 'material-ui/Modal';
import {CreateCourse} from '../components/courses/';
import Notification from '../components/notification';
import {BASE_URL} from '../config';
import * as courseAction from '../actions'
  /**
   * A simple table demonstrating the hierarchy of the `Table` component and its sub-components.
   */

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  container: {
    display: 'inline-block',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 400,
  },
  menu: {
    width: 200,
  },
  card: {
    minWidth: 275,
  },
  superCard:{
    width:'200px',
    marginLeft:'auto',
    marginRight:'auto'
  },
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
});

function getModalStyle() {
  const top = '50';
  const left = '50';

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}


 class Courses extends React.Component{
    constructor(prop){
      super(prop)
      this.state={
        courseModelActive:false,
        password:'',
        name:'',
        desc:'',
        open: false,
        message:null,
        value: 0,
        courseLink:null,
        nameRequired:false,
        pwdRequired:false,
        coursePwdMatched: null,
        joinPwdLoading:''
      }
        this.handleInput=this.handleInput.bind(this)
    }

    handleChange = (event, value) => {
      this.setState({ value });
    };

    handleNotification = (msg) => {
      this.setState({ open: true,message:msg });
    };
  
    closeNotification = () => {
      this.setState({ open: false });
    };

    handleInput=(e)=>{
      this.setState({[e.target.name]:e.target.value})
    }
    createCourse=()=>{
      this.setState({courseModelActive:true})
    }
    cancelSubmit=()=>{
      
      this.setState({
        name: '',
        desc: '',
        password: '',
        nameRequired:false,
        pwdRequired:false,
        courseModelActive:false,
        courseLink:null})
    }
    joinCourse = ({ password, courseKey }) => {
      this.setState({ coursePwdMatched: null });
      this.props.firebase
        .set(`studentCoursePasswords/${courseKey}/${this.props.auth.uid}`, password)
        .then(d => {
         
          this.setState({ coursePwdMatched: 'MATCHED' });
          this.props.firebase.set(`memberCourses/${this.props.auth.uid}/${courseKey}`, true);
          this.props.firebase.set(`courseMembers/${courseKey}/${this.props.auth.uid}`, true);
        })
        .catch(e => {
          if (e.code === 'PERMISSION_DENIED') {
            this.setState({ coursePwdMatched: 'NOT_MATCHED' });
      }
        });
    }
  submitCourse = formData => {
    const passsword = formData.password;
    const course = {
      title: formData.name,
      owner: this.props.auth.uid,
    };
    if(formData.name === '' && formData.password!=='')
        this.setState({nameRequired:true, pwdRequired:false})
        if(formData.name !== '' && formData.password ==='')
        this.setState({pwdRequired:true, nameRequired:false})
        if(formData.name === '' && formData.password ==='')
        this.setState({pwdRequired:true, nameRequired:true})
        if(formData.name !== '' && formData.password !=='')
        this.setState({pwdRequired:false, nameRequired:false})
       //  push data to firebase
       this.props.firebase.push('courses', course).then(data => {
          // wait for db to send response\
        this.setState({ courseLink: `${BASE_URL}#/courses/${data.key}` });
        this.props.firebase.set(`coursePasswords/${data.key}`, passsword);
          this.handleNotification(`Course Added Successfuly!`);
      });
  }
  render(){
    const {classes, courses, auth, firebase, publicCourses, joinedCourses}  = this.props;
    const { open, message, courseLink, nameRequired, pwdRequired ,coursePwdMatched} = this.state;
    let publicCourse;
    if(publicCourses){
      publicCourse = publicCourses.filter( course => course.value.owner === auth.uid ? false : true );
    }
  return(
    <div>
        <Notification message={message} open={open} handleClose={this.closeNotification}/>
        <AppFrame pageTitle="Courses" >
         <Button raised onClick={this.createCourse}>Create a Course</Button>
         <CourseTable firebase={firebase} courses={courses} auth={auth} 
          publicCourses={publicCourse} joinedCourses={joinedCourses} joinCourse={this.joinCourse}
          coursePwdMatched={coursePwdMatched}/> 
         <div>
            {!courseLink && 
         <CreateCourse 
         openModel={this.state.courseModelActive} 
         handleSubmit={this.submitCourse} 
         handleClose={this.cancelSubmit} 
         handleInput={this.handleInput}
         name={this.state.name}
         password={this.state.password}
         nameRequired={nameRequired}
         pwdRequired={pwdRequired}
         />        
          }
         {courseLink && 
          <Modal 
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={this.state.courseModelActive}
            onClose={this.cancelSubmit}
          >
            <div style={getModalStyle()} className={classes.paper}>
              <h3>This is the URL that can be shared to all participants in the course.</h3>
              <h4>{courseLink}</h4> 
              <Button raised color="primary" type="submit" onClick={this.cancelSubmit} >Okay</Button>
            </div>
          </Modal>
          }
          </div>
      </AppFrame>
    </div>
  )
}
}


 const mapDispatchToProps = (dispatch) => {
  return {
      joinCourse: (payload) => {
      dispatch(courseAction.joinCourse(payload))
    }
  }
}
const CoursesWithFirebase = compose(
  connect((state)=>({
    joinPwdLoading :state.courses.passwordMatchLoading,
   //  allJoinesPwd: state.courses
  }), mapDispatchToProps),
  firebaseConnect( (props, store) => {
  const uid=store.getState().firebase.auth.uid;
    return [
    {
      path:`courses`,   
      storeAs:'myCourses', 
      queryParams:  [ 'orderByChild=owner', `equalTo=${uid}` ]
    },
    {
      path:'courses',
      storeAs: 'publicCourses'
    },
    {
      path:`memberCourses/${uid}`,
      storeAs:'joinedCourses'
    }
  ]
  }),
  connect(({ firebase }) => ({ 
    auth: firebase.auth, 
    courses: firebase.ordered.myCourses, 
    publicCourses: firebase.ordered.publicCourses,
    joinedCourses: firebase.ordered.joinedCourses
  }))
)(Courses)

 Courses.propTypes = {
  classes: PropTypes.object.isRequired,
  courses: PropTypes.array,
  auth: PropTypes.object.isRequired,
  publicCourses: PropTypes.array
}

export default withStyles(styles)(CoursesWithFirebase)