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
  paddingLt:{
    paddingLeft:'47px'
  },
  paddingLs:{
    paddingLeft:'70px'
  },
  container: {
    display: 'inline-block',
    flexWrap: 'wrap',
  },
});

class InstructorViews extends React.Component {
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
      message:null
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
    const { classes, data, columnData, showTable , openNotebook} = this.props;
    const { order, orderBy, selected, rowsPerPage, page, open, message } = this.state;
    const emptyRows = data ? rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage):'';

    return (
        <div>
      <Notification message={message} open={open} handleClose={this.closeNotification}/>
      {showTable  && <Paper className={classes.root}>
            <EnhancedTableToolbar title='Assignments'  numSelected={selected.length} deleteOpr={this.deleteData} />
            {data ? <div className={classes.tableWrapper}>
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
                {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((n,id) => {
                const isSelected = this.isSelected(n.key);
                return (
                    <TableRow
                    hover
                    onClick={event => this.handleClick(event, n.key)}
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={-1}
                    key={n.key}
                    selected={isSelected}
                    >
                    <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} />
                    </TableCell>
                    <TableCell padding="none">{n.value.name} <br/>  {n.value.path && (<a href="javascript:void(0)" onClick={()=>{openNotebook(n)}}>View</a>)}</TableCell>
                    <TableCell className={classes.paddingLs}>Complete</TableCell>
                    <TableCell className={classes.paddingLs}>Team1</TableCell>
                    <TableCell className={classes.paddingLs}>Team2</TableCell>
                    <TableCell className={classes.paddingLs}>Complete</TableCell>
                    <TableCell className={classes.paddingLs}>Team3</TableCell>
                   
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
                    colSpan={6}
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
            </div> :''}
                </Paper> }
       
      </div>
    );
  }
}

InstructorViews.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array,
  columnData:PropTypes.array.isRequired,
  create:PropTypes.func.isRequired,
  showTable:PropTypes.bool.isRequired
};

export const InstructorView = withStyles(styles)(InstructorViews);


