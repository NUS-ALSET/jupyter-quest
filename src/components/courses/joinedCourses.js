import React from 'react';
import {Link} from 'react-router-dom';
export const JoinedCourses = ({joinedCourses}) => (
    <ul>
        {joinedCourses ? joinedCourses.map( (item,index) => <li key={item.key} ><Link to={`courses/${item.key}`}>{item.value.title}</Link></li> ) : ''}
    </ul>
)
