import React, {Component} from 'react'
import Modal from 'material-ui/Modal';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';

function getModalStyle() {
    const top = '50';
    const left = '50';
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }
  const styles = theme => ({
    paper: {
      position: 'absolute',
      width: theme.spacing.unit * 50,
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing.unit * 4,
      maxHeight:'400px',
      overflowY:'scroll'
    },
  });

  class AssignmentDialog extends Component{

    render() {
    const {open, classes,content,closeDialogBox}=this.props;
        return(
            <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={open}
            >
            <div style={getModalStyle()} className={classes.paper}>
            <Typography type="title" id="modal-title">
            <p dangerouslySetInnerHTML={content}></p>
            </Typography>
            <Typography type="subheading" id="simple-modal-description">
                <Button className="cancelBtn" onClick={closeDialogBox}
                raised color="default" >Close</Button>
            </Typography>
            </div>
        </Modal>
        )
    }
}
export default withStyles(styles)(AssignmentDialog);