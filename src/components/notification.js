import React from 'react'
import Snackbar from 'material-ui/Snackbar';

const Notification=({open, message, handleClose})=>(

    <Snackbar
    anchorOrigin={{ vertical:'top', horizontal:'right' }}
    open={open}
    autoHideDuration={3000}
    onClose={()=>handleClose()}
    SnackbarContentProps={{
      'aria-describedby': 'message-id',
    }}
    message={<span id="message-id">{message}</span>}
    />  

)

export default Notification