import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'
import Button from 'material-ui/Button/Button';
import {TableRow,TableCell} from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox';


class StudentRow extends React.Component {

  render() {
    const { userId, isMe, displayName, handleNotification, openNotebook } = this.props;
    const { assignMentList =[] } = this.props;
    const isSelected = false; 

    return (

            <TableRow
                hover
                role="checkbox"
                aria-checked={isSelected}
                tabIndex={-1}
               selected={isSelected}
                    key={userId}                
                    >
                    <TableCell padding="checkbox">
                        <Checkbox checked={isSelected}/>
                    </TableCell>
                    <TableCell padding="none">{displayName}</TableCell>
                    {assignMentList.map((list,index)=>{
                      return(
                       <TableCell key={index} padding="none">
                       {isMe ? <div>
                       {list.value.path && <Button raised color="default" onClick={()=>openNotebook(list)}>View</Button>} 
                       <Button raised color="default" onClick={()=>handleNotification("Function to be developed")}>Submit</Button>
                       </div>
                       : 'NOT COMPLETED'} 
                       </TableCell >)
                    })}
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

