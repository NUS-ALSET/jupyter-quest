import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'
import Button from 'material-ui/Button/Button';
import {TableRow,TableCell} from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox';


class StudentRow extends React.Component {
  constructor(props, context) {
    super(props, context);
  }


  render() {
    const {userId,isMe,displayName, handleNotification}=this.props;
    let {assignMentList}=this.props;
    const isSelected=false; 
    assignMentList=assignMentList.filter(list=>list.id!==0)
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
                    {assignMentList.map((list,index)=>{
                      return(
                       <TableCell key={index} padding="none">
                       {isMe ? <Button raised color="default" onClick={()=>handleNotification("Function to be developed")}>Edit</Button> : 'NOT COMPLETED'} 
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

