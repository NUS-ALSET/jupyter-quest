import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import keycode from 'keycode';
import Table, {
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from 'material-ui/Table';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';
import DeleteIcon from 'material-ui-icons/Delete';
import FilterListIcon from 'material-ui-icons/FilterList';



let EnhancedTableToolbar = props => {
    const { numSelected, classes, title } = props;
  
    return (
      <Toolbar
        className={classNames(classes.root, {
          [classes.highlight]: numSelected > 0,
        })}
      >
        <div className={classes.title}>
          {numSelected > 0 ? (
            <Typography type="subheading">{numSelected} selected</Typography>
          ) : (
              <Typography type="title">{title}</Typography>
            )}
        </div>
        <div className={classes.spacer} />
        <div className={classes.actions}>
          {numSelected > 0 ? (
            <Tooltip title="Remove from class">
              <IconButton aria-label="Delete">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          ) : (
              <Tooltip title="Filter list">
                <IconButton aria-label="Filter list">
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
            )}
        </div>
      </Toolbar>
    );
};
  
const toolbarStyles = theme => ({
    root: {
      paddingRight: 2,
    },
    highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.secondary.A700,
        backgroundColor: theme.palette.secondary.A100,
      }
      : {
        color: theme.palette.secondary.A100,
        backgroundColor: theme.palette.secondary.A700,
      },
    spacer: {
      flex: '1 1 100%',
    },
    actions: {
      color: theme.palette.text.secondary,
    },
    title: {
      flex: '0 0 auto',
    },
  });

  
  EnhancedTableToolbar.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
};
  
export default EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);
  