import React from 'react';
import PropTypes from 'prop-types';
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

// components

import EnhancedTableHead from '../table/enhancedTableHead';
import EnhancedTableToolbar from '../table/enhancedTableToolbar';
import Notification from '../notification'
import StudentRow from "./studentRow"
import AsignmentDialog from "./assignmentDialog"


const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    flexGrow: 1,
  },
  table: {
    minWidth: 800,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
  paddingLt:{
    paddingLeft:'25px'
  },
  paddingLs:{
    paddingLeft:'70px'
  }
});

class AssignmentLists extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      order: 'asc',
      orderBy: 'name',
      selected: [],
      page: 0,
      rowsPerPage: 5,
      checkedA: true,
      open: false,
      message:null,
      openDialog : false,
      content :{__html :''} 
    };
  }
  handleDilogBox=(text)=>{
	  const exp = /(\b(https?|http|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
	  const text1=text.replace(exp, "<a target='_blank' href='$1'>$1</a>");
	  const exp2 =/(^|[^\/])(www\.[\S]+(\b|$))/gim;
    const dialogText=text1.replace(exp2, '$1<a target="_blank" href="http://$2">$2</a>');
    this.setState({content : {__html : dialogText},openDialog:true});
  }
  closeDialogBox=()=>{
    this.setState({openDialog:false,content : {__html : ''}});
  }
  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    const data =
      order === 'desc'
        ? this.props.data.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
        : this.props.data.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

    this.setState({ data, order, orderBy });
  };

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setState({ selected: this.props.studentList.map(n => n.key) });
      return;
    }
    this.setState({ selected: [] });
  };

  handleKeyDown = (event, id) => {
    if (keycode(event) === 'space') {
      this.handleClick(event, id);
    }
  };

 handleNotification = (msg) =>{
    this.setState({ open: true,message:msg });
  };

  closeNotification = () => {
    this.setState({ open: false });
  };

  handleClick = (event, id) => {
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

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  handleChange = name => (event, checked) => {
    this.setState({ [name]: checked });
  };


  deleteData=()=>{
    this.handleNotification("To be implemented")
    this.setState({selected:[]})
  }

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const { classes, columnData, showTable, auth ,assignments,openNotebook} = this.props;
    let {studentList}=this.props;
    const { order, orderBy, selected, rowsPerPage, page, open, message,content,openDialog } = this.state;
    const emptyRows = studentList ? rowsPerPage - Math.min(rowsPerPage, studentList.length - page * rowsPerPage):'';
    studentList = studentList ?studentList : []; 
    return (
        <div>
      <AsignmentDialog open={openDialog} content={content} closeDialogBox={this.closeDialogBox}/>
      <Notification message={message} open={open} handleClose={this.closeNotification}/>
      {showTable  && <Paper className={classes.root}>
         <div><EnhancedTableToolbar title='Assignments'  numSelected={selected.length} deleteOpr={this.deleteData} />
            <div className={classes.tableWrapper}>
            <Table className={classes.table}>
                <EnhancedTableHead
                columnData={columnData}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={this.handleSelectAllClick}
                onRequestSort={this.handleRequestSort}
                rowCount={studentList.length}
                handleDilogBox={this.handleDilogBox}
                />
                <TableBody>
                  
                {studentList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((student,id) => {
                const isMe=student.key===auth.uid ? true:false;
                return (
                <StudentRow key={student.key} isMe={isMe} assignMentList={assignments} handleNotification={this.handleNotification} openNotebook={(list)=>openNotebook(list)} userId={student.key}/>                
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
                    colSpan={6}
                    count={studentList.length}
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
            </div>        
        </Paper> }
       
      </div>
    );
  }
}

AssignmentLists.propTypes = {
  classes: PropTypes.object.isRequired,
  columnData:PropTypes.array.isRequired,
  showTable:PropTypes.bool.isRequired,
  assignments : PropTypes.array.isRequired
};

export const AssignmentList = withStyles(styles)(AssignmentLists);


