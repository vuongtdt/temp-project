import { Alert, Snackbar } from '@mui/material'
import React from 'react'

type Props = {
    open: boolean,
    onClose: Function,
    vertical?: 'bottom' | 'top',
    horizontal?: 'left' | 'center' | 'right',
    text: string,
    type?: 'success' | 'info' | 'warning' | 'error',
}

const AlertComponent = (props: Props) => {
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        props.onClose();
    };
    let vertical =  props.vertical || 'top';
    let horizontal =  props.horizontal || 'left';
    let type =  props.type || 'warning';
    return (
        <Snackbar open={props.open} autoHideDuration={3000} onClose={handleClose} anchorOrigin={
            { vertical,  horizontal}
        }>
            <Alert onClose={handleClose} severity={type} sx={{ width: '100%' }}>
                {props.text}
            </Alert>
        </Snackbar>
    )
}

export default AlertComponent