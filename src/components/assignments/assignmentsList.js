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
import Checkbox from 'material-ui/Checkbox';
import Switch from 'material-ui/Switch';
import SwapVertIcon from 'material-ui-icons/SwapVert';
import Tabs, { Tab } from 'material-ui/Tabs';


// components

import EnhancedTableHead from '../table/enhancedTableHead';
import EnhancedTableToolbar from '../table/enhancedTableToolbar';
import Button from 'material-ui/Button/Button';
import Notification from '../notification'
import StudentRow from "./studentRow"
import Notebook from '../../modules/notebook'


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
      value: 0,
      selectedAssignment:''
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

  handleTabs = (event, value) => {
    if(value===1){
      return;
    }
    this.setState({ value });
  };

  deleteData=()=>{
    const {} = this.props;
    this.handleNotification("To be implemented")
    this.setState({selected:[]})
  }
  openNotebook=(assignment)=>{
    console.log('selected assignment',assignment.value.path)
    this.setState({selectedAssignment:assignment.value.path, value:1});
    
;  }  


  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const { classes, data, columnData, create, showTable, auth ,assignments} = this.props;
    let {studentList}=this.props;
    const { order, orderBy, selected, rowsPerPage, page, open, message ,value, selectedAssignment} = this.state;
    const emptyRows = studentList ? rowsPerPage - Math.min(rowsPerPage, studentList.length - page * rowsPerPage):'';
    studentList = studentList ?studentList : []; 
    return (
        <div>
      <Notification message={message} open={open} handleClose={this.closeNotification}/>
      {showTable && <Paper className={classes.root}>
      <Tabs
          value={this.state.value}
          indicatorColor="primary"
          onChange={this.handleTabs}
          textColor="primary"
          centered
        >
        <Tab label="Assignments" />
          <Tab label="Notebook" />
        </Tabs>
        {value === 0 && <div><EnhancedTableToolbar title='Assignments'  numSelected={selected.length} deleteOpr={this.deleteData} />
            { <div className={classes.tableWrapper}>
            <Table className={classes.table}>
                <EnhancedTableHead
                columnData={columnData}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={this.handleSelectAllClick}
                onRequestSort={this.handleRequestSort}
                rowCount={studentList.length}
                />
                <TableBody>
                  
                {studentList.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((student,id) => {
                const isSelected = this.isSelected(student.key);
                const isMe=student.key===auth.uid ? true:false;
                return (
                <StudentRow key={student.key} isMe={isMe} assignMentList={assignments} handleNotification={this.handleNotification} openNotebook={(list)=>this.openNotebook(list)} userId={student.key}/>                
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
            </div>}</div>}
        {value === 1 && selectedAssignment && <div><Notebook pathId={selectedAssignment} /></div>}
            
        </Paper> }
       
      </div>
    );
  }
}

AssignmentLists.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array,
  columnData:PropTypes.array.isRequired,
  create:PropTypes.func.isRequired,
  showTable:PropTypes.bool.isRequired,
  assignments : PropTypes.array.isRequired
};

export const AssignmentList = withStyles(styles)(AssignmentLists);


