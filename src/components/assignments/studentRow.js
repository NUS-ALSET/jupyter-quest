import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'
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
    paddingLeft:'25px'
  },
  paddingLs:{
    paddingLeft:'70px'
  }
});

class StudentRow extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      
    };
  }


  render() {
    const {userId,isMe,displayName, handleNotification}=this.props;
    const isSelected=false;
    return (
        
            <TableRow
                hover
                role="checkbox"
                aria-checked={isSelected}
                tabIndex={-1}
               selected={isSelected}
                    key={this.props.userId}
                   
                    >
                    <TableCell padding="checkbox">
                        <Checkbox checked={isSelected}/>
                    </TableCell>
                    <TableCell padding="none">{displayName}</TableCell>
                    <TableCell padding="none">
                   {isMe ? <Button raised color="default" onClick={()=>handleNotification("Function to be developed")}>Edit</Button> : 'COMPLETED'} 
                   </TableCell >
                   <TableCell padding="none">
                   {isMe ? <Button raised color="default" onClick={()=>handleNotification("Function to be developed")}>Submit</Button> : 'COMPLETED'} 
                   </TableCell >
                   <TableCell padding="none">   
                   {isMe ? <Button raised color="default" onClick={()=>handleNotification("Function to be developed")}>Submit</Button> : 'COMPLETED'} 
                   </TableCell >
                    </TableRow> 
          
    );
  }
}

export default compose(
    firebaseConnect( (props, store) => [
        {
          path: `users/${props.userId}/displayName`,
          storeAs:props.userId
        },
      ]),
    connect(({ firebase }, props) => ({ 
        displayName: firebase.data[props.userId] 
    }))
  )(StudentRow)

StudentRow.propTypes = {
  userId : PropTypes.string.isRequired,
  isMe : PropTypes.bool.isRequired
};

