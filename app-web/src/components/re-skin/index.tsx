import { Box, Button, ListItem, styled, TextField, Typography, } from '@mui/material';
import { useChatStore } from 'store/chatStore';
import { LoadingButton } from '@mui/lab';
import listBG from 'Assets/Images/re-skin/listBG.png'

export const ConnectedListItem = styled(ListItem)(() => {
    const { theme } = useChatStore();
    return {
        borderBottom: `1px solid ${theme.borderColor}`,
        color: theme.color,
        justifyContent: "space-between",
        '&:nth-last-of-type()': {
            borderBottom: 'none',
        },
    }
});

export const PlatformListItem = styled(ListItem)(() => {
    const { theme } = useChatStore();
    return {
        borderBottom: `1px solid ${theme.borderColor}`,
        color: theme.color,
        justifyContent: "space-between",
        '&:nth-last-of-type()': {
            borderBottom: 'none',
        },
    }
});

export const Text = styled(Typography)(() => {
    const { theme } = useChatStore();
    return {
        color: theme.color,
        marginBottom: 0,
    }
});

export const LoadingButtonN = styled(LoadingButton)(() => {
    const { theme } = useChatStore();
    return {
        color: theme.navColor,
        border: `1px solid ${theme.textColor}`,
        '&:hover': {
            backgroundColor: theme.textColor,
            color: theme.mainColor,
        },
    }
});

export const BoxBG = styled(Box)(() => {
    return {
        maxHeight: '50vh',
        overflowY: 'auto',
        borderImage: "linear-gradient(to left, #c4b5df, transparent, #fff, transparent, #fff) 30",
        borderWidth: "5px",
        borderStyle: "solid",
        background: `url(${listBG}) center center`,

    }
});

export const ButtonRS = styled(Button)(() => {
    const { theme } = useChatStore();
    return {
        backgroundColor: 'transparent',
        color: theme.navColor,
        border: `1px solid ${theme.textColor}`,
        '&:hover': {
            backgroundColor: theme.textColor,
            color: theme.mainColor,
        },

    }
});

export const TextFieldN = styled(TextField)(() => {
    const { theme } = useChatStore();
    return {
        '.MuiSelect-select': {
            color: theme.color,
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '20vw',
            overflow: 'hidden',
        },
        '.MuiOutlinedInput-input.MuiInputBase-inputSizeSmall': {
            padding: '2px 8px',
            // fontSize:'13px',
        },
        'label, label.Mui-disabled': {
            color: 'grey',
            fontSize: '13px',
            top: '-5px',
        },
        'input': {
            color: theme.color,
        },
        'fieldset': {
            color: theme.color,
            borderColor: 'inherit',
            fontSize: '13px',
        },
        '.MuiOutlinedInput-root.MuiInputBase-colorPrimary': {
            color: theme.color,
        },
        '& label.Mui-focused': {
            color: theme.noteColor,
            fontSize: '13px',
            top: '2px',
        },
        '& label.MuiFormLabel-filled': {
            top: '2px',
        },
        '& .MuiInput-underline:after': {
            borderBottomColor: theme.noteColor,
        },
        '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
                borderColor: theme.noteColor,
            },
            '&:hover fieldset': {
                borderColor: theme.noteColor,
            },
        },
        '@media (max-width:1700px)': {
            'fieldset': {
                fontSize: '10px',
            },
        },
    }
});
