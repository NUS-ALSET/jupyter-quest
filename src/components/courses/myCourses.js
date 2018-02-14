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
import { Link } from 'react-router-dom';


// components

import EnhancedTableHead from '../table/enhancedTableHead';
import EnhancedTableToolbar from '../table/enhancedTableToolbar';
import Notification from '../notification'

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

class MyCourse extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      order: 'asc',
      orderBy: 'name',
      selected: [],
      page: 0,
      rowsPerPage: 5,
      message:null,
      open:false
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
      this.setState({ selected: this.props.data.map(n => n.key) });
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

  handleNotification = (msg) =>{
    this.setState({ open: true, message:msg });
  };

  closeNotification = () => {
    this.setState({ open: false });
  };

  deleteData=()=>{
    this.handleNotification("Firebase function for deleting assignment along with courses is pending.")
    const {firebase} = this.props;
    let selectedData = this.state.selected;
   // remove course from db.
     selectedData.forEach( courseId => {
      firebase.remove(`courses/${courseId}/`)
      //.then( id => this.handleNotification("Delete Course Successfully"))
      //.catch( err => this.handleNotification("Found Error"))
    } )
    this.setState({selected:[]})
  }

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const { classes, data, columnData } = this.props;
    const { order, orderBy, selected, rowsPerPage, page, message, open } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <Paper className={classes.root}>
      <Notification message={message} open={open} handleClose={this.closeNotification}/>
        <EnhancedTableToolbar title='Courses'  numSelected={selected.length} deleteOpr={this.deleteData} />
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <EnhancedTableHead
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
                  const isSelected = this.isSelected(course.key);
                return (
                    <TableRow
                      hover
                      onClick={event => this.handleClick(event, course.key)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={course.key}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} />
                      </TableCell>
                      <TableCell padding="none"><Link to={`/courses/${course.key}`}>{course.value.title}</Link></TableCell>
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
    );
  }
}

MyCourse.propTypes = {
  classes: PropTypes.object.isRequired,
};

export const MyCourses = withStyles(styles)(MyCourse);



