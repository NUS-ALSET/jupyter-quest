import React from 'react';
import { Link} from 'react-router-dom';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'
export const JoinedCourses = ({course,title}) => (
       <li key={course.key} ><Link to={`courses/${course.key}`}>{title}</Link></li>
  
)

export default compose(
    firebaseConnect( (props, store) => [
        {
          path: `courses/${props.course.key}/title`,
          storeAs:props.course.key
        },
      ]),
    connect(({ firebase }, props) => ({ 
        title: firebase.data[props.course.key] 
    }))
  )(JoinedCourses)


