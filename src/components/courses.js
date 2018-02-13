import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';

// components
import {
  MyCourses,
  JoinedCourses,
  PublicCourses} from '../components/courses/';


const columnData = [
  { id: 'name', numeric: false, disablePadding: true, label: 'Course name' },
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
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    marginBottom: 16,
    fontSize: 14,
    color: theme.palette.text.secondary,
  },
  pos: {
    marginBottom: 12,
    color: theme.palette.text.secondary,
  },
});

// Courses Table 

class CoursesContainer extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      order: 'asc',
      orderBy: 'name',
      selected: [],
      page: 0,
      rowsPerPage: 5,
      value: 0,
    };
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const { classes, courses, publicCourses, firebase, auth, joinedCourses, joinCourse, passwordMatchLoading} = this.props;
    let activeTab = <h2>No data</h2>;
    switch (this.state.value) {
      case 0 : {
        activeTab = courses ? <MyCourses columnData={columnData} firebase={firebase}  data={courses}  /> : <h2>No data</h2>;
        break;
      }
      case 1 : {
        activeTab = <JoinedCourses joinedCourses={joinedCourses} />
        break;
      }
      case 2: {
        activeTab = publicCourses ? <PublicCourses columnData={columnData}
         firebase={firebase} auth={auth} data={publicCourses} joinedCourses={joinedCourses} 
         joinCourse={joinCourse} passwordMatchLoading={passwordMatchLoading}/>: <h2>No data</h2>;
        break;
      }
      default : {
        break;
      }
    }

    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Tabs value={this.state.value} onChange={this.handleChange}>
            <Tab label="My Course" />
            <Tab label="Joined Course" />
            <Tab label="Public Course" />
          </Tabs>
        </AppBar>
        {activeTab}
      </div>
  );
}
}

CoursesContainer.propTypes = {
  classes: PropTypes.object.isRequired,
  courses: PropTypes.array, 
  publicCourses: PropTypes.array
};

export default withStyles(styles)(CoursesContainer);
