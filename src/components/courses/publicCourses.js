import React from 'react';
import { withStyles } from 'material-ui/styles';
import keycode from 'keycode';
import Table, {
  TableBody,
  TableCell,
  TableFooter,
  TablePagination,
  TableRow,
} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
import { Link } from 'react-router-dom';
import JoinModel from './joinModel'
import Snackbar from 'material-ui/Snackbar';

// components

import EnhancedTableHead from '../table/enhancedTableHead';
import EnhancedTableToolbar from '../table/enhancedTableToolbar';
import Button from 'material-ui/Button/Button';


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
  paddingLt:{
    paddingLeft:'13px'
  },
 
});

class PublicCourse extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      order: 'asc',
      orderBy: 'name',
      selected: [],
      page: 0,
      rowsPerPage: 5,
      openModel: false, 
      openNotification:false, 
      password:'',
      vertical: 'top',
      horizontal: 'right',
      message:null,
      coursePwd:null,
      courseId:null,
      courseName:'',
      isTrue:true,
      isPasswordFormSubmitted : false,
    };
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    const data =
      order === 'desc'
        ? this.state.data.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
        : this.state.data.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

    this.setState({ data, order, orderBy });
  };

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setState({ selected: this.props.data.map(n => n.id) });
      return;
    }
    this.setState({ selected: [] });
  };

  handleKeyDown = (event, id) => {
    if (keycode(event) === 'space') {
      this.handleClick(event, id);
    }
  };

  handleClick = (event, id) => {
      let b = event.target.parentNode.className;
      if(b.includes('cancelBtn')){
          return;
      }
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    this.setState({ selected: newSelected });
  };

  openNotification = (msg) =>{
    this.setState({ openNotification: true,message:msg });
  };

  closeNotification = () => {
    this.setState({ openNotification: false });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };
 
  submitJoin=(e)=>{
    let coursePasswordHash = this.state.coursePwd
    let studentPwd = e.password
    this.setState({isPasswordFormSubmitted:true});
    this.props.joinCourse({password: studentPwd,coursePassword:coursePasswordHash});
  }
  handlePasswordCheck(joinCoursePwdMatch,joinPwdLoading){
    // loader false
    this.setState({isPasswordFormSubmitted:false});
    let joinCourses = {joined:true, title:this.state.courseName}
    if(joinCoursePwdMatch=="MATCHED"){
      this.handleClose();
      this.props.firebase.set(`memberCourses/${this.props.auth.uid}/${this.state.courseId}`,true)
      .then(data=>{
        this.setState({isTrue:false})
      this.openNotification("Course Joined Successfully")
      })
    }else{
      this.openNotification("Password not match")
    }
  }

  handleOpen = (pwd, courseKey, courseName) => {
    this.setState({ openModel: true, coursePwd:pwd, courseId:courseKey, courseName: courseName });
  };

  handleClose = (e) => {
    this.setState({ openModel: false, password:'' });
  };

  handleInput=(e)=>{
    this.setState({[e.target.name]:e.target.value })
  }

  componentWillReceiveProps(nextProps){
    const { joinCoursePwdMatch, joinPwdLoading} = nextProps;
    if(this.state.isPasswordFormSubmitted && joinCoursePwdMatch!=null){
      this.handlePasswordCheck(joinCoursePwdMatch,joinPwdLoading);
    }
  }

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const { classes, data, columnData, joinCoursePwdMatch, joinPwdLoading,auth, joinedCourses} = this.props;
    const { order, orderBy, selected, rowsPerPage, page, password, vertical,openNotification, horizontal, message, isTrue,isPasswordFormSubmitted } = this.state;
    const emptyRows = data ? rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage) :'';
    return (
        <div>
        <Paper className={classes.root}>
        <EnhancedTableToolbar title='Public Courses'  numSelected={selected.length} />
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <EnhancedTableHead
              isCheckbox='true'
              columnData={columnData}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
            {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((course,id) => {
               return (
                    <TableRow
                      key={id}
                    >
                      <TableCell padding="checkbox">
                      </TableCell>
                      <TableCell padding="none"><Link to={`/courses/${course.key}`}>{course.value.title}</Link></TableCell>
                      <TableCell> 
                    {joinedCourses && joinedCourses.filter((jc) =>jc.key === course.key).length>0 ? 
                    <h3 className={classes.paddingLt}>Already joined</h3> :
                    <Button className="cancelBtn" 
                      raised color="primary" onClick={()=>this.handleOpen(course.value.pass, course.key, course.value.title)}>Join Course</Button>
                    }
                      </TableCell>
                    </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  count={data.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  backIconButtonProps={{
                    'aria-label': 'Previous Page',
                  }}
                  nextIconButtonProps={{
                    'aria-label': 'Next Page',
                  }}
                  onChangePage={this.handleChangePage}
                  onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </Paper>  
            <JoinModel 
            openModel={this.state.openModel}
            handleClose={this.handleClose}
            handleSubmit={this.submitJoin}
            password={password}
            handlePassword={this.handleInput}
            />

             <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={openNotification}
        onClose={this.closeNotification}
        SnackbarContentProps={{
          'aria-describedby': 'message-id',
        }}
        message={<span id="message-id">{message}</span>}
        />
      </div>      
    );
  }
}


export const PublicCourses = withStyles(styles)(PublicCourse);





