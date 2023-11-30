
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { LoadingButton } from '@mui/lab';
import { FormattedMessage } from 'react-intl';
import React from 'react';
import translate from '../../translations';
import { Box, TextField } from '@mui/material';
import EventNoteOutlinedIcon from '@mui/icons-material/EventNoteOutlined';
import { useChatStore } from '../../store/chatStore';
type Props = {
    note: string,
    setNote: Function
}
export default (props: Props) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const { theme } = useChatStore();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'items-popover' : undefined;
    const changeValue = (e) => {
        props.setNote(e?.target?.value);

    }
    return (
        <div>
            <LoadingButton aria-describedby={id} size="small" onClick={handleClick} sx={{
                color: theme.noteColor
            }}>
                <EventNoteOutlinedIcon sx={{ mr: '5px' }} />
                <Typography component='p' sx={{
                    fontSize: '12px',
                    whiteSpace: 'nowrap',
                }}>
                    {props.note ? <FormattedMessage
                        id="orders.Chỉnh sửa ghi chú"
                        defaultMessage="Chỉnh sửa ghi chú"
                    /> : <FormattedMessage
                        id="orders.Thêm ghi chú"
                        defaultMessage="Thêm ghi chú"
                    />}
                </Typography>
            </LoadingButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                sx={{ width: '100%' }}
            >
                <Box sx={{ p: 1 }}>
                    <TextField
                        value={props.note}
                        id="outlined-multiline-flexible"
                        label={translate('orders.Nhập ghi chú...', 'Nhập ghi chú...')}
                        multiline
                        maxRows={4}
                        onChange={changeValue}
                    />
                </Box>
            </Popover>
        </div>
    );
}