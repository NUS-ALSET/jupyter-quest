import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'
import {CourseDetail} from './courseDetail'

class AssignmentsDetail extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isInstructor : null,
      assignmentQueryParams :[]
    };
  }

componentWillMount(){
  this.props.firebase.database().ref(`/courses/${this.props.match.params.id}`).once('value')
  .then((snapshot)=> {
    const course=snapshot.val();
    if(course && course.owner===this.props.auth.uid){
      this.setState({ isInstructor :true, assignmentQueryParams :[]})
    }else{
        this.setState({ isInstructor :false, assignmentQueryParams :[ 'orderByChild=assignmentVisibility', `equalTo=true` ]})
    }
  })
  .catch(e=>{
    console.log(e);
  })
}
  render() {
    const { match } = this.props;
    const {isInstructor,assignmentQueryParams}=this.state;
    return (
        <div>
        {
            isInstructor ===null ?  'Loading...' : <CourseDetail match={match} isInstructor={isInstructor} assignmentQueryParams={assignmentQueryParams} /> 
        }
        </div>
        )
  }
}

export const AssignmentWithFirebase = compose(
  firebaseConnect( (props, store) => [ ]),
  connect(({ firebase }) => ({ 
    auth: firebase.auth,
  }))
)(AssignmentsDetail)

AssignmentsDetail.propTypes = {
  auth: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  firebase: PropTypes.object.isRequired,
};
