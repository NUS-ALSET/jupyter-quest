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



// components

import EnhancedTableHead from '../table/enhancedTableHead';
import EnhancedTableToolbar from '../table/enhancedTableToolbar';
import Button from 'material-ui/Button/Button';
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
});

class EditAssignments extends React.Component {
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
    const {firebase, uid} = this.props;
    let selectedData = this.state.selected;
    // remove assignment from db.
    selectedData.forEach( assignmentId => {
      firebase.remove(`assignment/${uid}/${assignmentId}/`)
      .then( id => this.handleNotification("Delete Assignment Successfully"))
      .catch( err => this.handleNotification("Found Error"))
    } )
    this.setState({selected:[]})
  }

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const { classes, data, columnData, create, showTable } = this.props;
    const { order, orderBy, selected, rowsPerPage, page, open, message } = this.state;
    const emptyRows = data ? rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage):'';

    return (
        <div>
      <Notification message={message} open={open} handleClose={this.closeNotification}/>
      <Button style={{marginLeft:'10px', marginBottom:'10px'}} raised color="primary" onClick={ () => create()}>Add assignment</Button>
      {showTable && <Paper className={classes.root}>
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
                    <TableCell padding="none">{n.value.name}</TableCell>
                    <TableCell numeric>
                    <Switch
                       // checked={this.state.checkedA}
                        onChange={this.handleChange('checkedA')}
                        aria-label="checkedA"
                        />
                    </TableCell>
                    <TableCell numeric>
                    <Switch
                       // checked={this.state.checkedB}
                        onChange={this.handleChange('checkedB')}
                        aria-label="checkedB"
                        />
                    </TableCell>
                    <TableCell className={classes.paddingLt}>22/12/2017</TableCell>
                    <TableCell className={classes.paddingLt}>5:45 AM</TableCell>
                    <TableCell className={classes.paddingLt}>02/01/2018</TableCell>
                    <TableCell className={classes.paddingLt}>2:05 PM</TableCell>
                    <TableCell className={classes.paddingLt}>Not Available</TableCell>
                    <TableCell className={classes.paddingLt}><SwapVertIcon /></TableCell>
                   
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

EditAssignments.propTypes = {
  classes: PropTypes.object.isRequired,
  data: PropTypes.array,
  columnData:PropTypes.array.isRequired,
  create:PropTypes.func.isRequired,
  showTable:PropTypes.bool.isRequired
};

export const EditAssignment = withStyles(styles)(EditAssignments);


