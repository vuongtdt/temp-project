import { Avatar, Box, IconButton, Popover, Stack, Typography } from '@mui/material'
import React, { Fragment, useEffect } from 'react'
import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import { useChatStore } from 'store/chatStore';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { ChatGo24Repository } from 'repositories/ChatGo24Repository';
import { useSelectConversationStore } from 'store/selectConversationStore';
import { FormattedMessage } from 'react-intl';
import { useTagsStore } from 'store/tagsStore';
import { useNavigate } from 'react-router-dom';
import { useTabSettingsStore } from 'store/tabSettingsStore';
import { TabSettings } from 'utils/enum';
type Props = {
    addTag: Function,
}

const TagPopover = (props: Props) => {
    const { tags, setTags } = useTagsStore();
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const { theme } = useChatStore();
    const { conversation } = useSelectConversationStore();
    const navigate = useNavigate();
    const { setTabSettings } = useTabSettingsStore();
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    useEffect(() => {
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const open = Boolean(anchorEl);
    const id = open ? 'tags-popover' : undefined;
    const handleAddTag = async (tag) => {
        const response = await ChatGo24Repository.UpdateConversation(conversation?.userId, conversation?.id, { userTags: [...conversation?.tags, tag] });
        if (response) props.addTag(tag);
    }
    const init = async () => {
        const response = await ChatGo24Repository.GetTags();
        if (response) setTags(response);
    }
    return (
        <Fragment>
            <IconButton onClick={handleClick}>
                <SellOutlinedIcon sx={{
                    width: '20px',
                    height: '20px',
                    transform: 'scaleX(-1)'
                }} />
            </IconButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                sx={{ width: '100%' }}
            >
                <Box sx={{ p: 1, bgcolor: theme.bgColor, color: theme.color }}>
                    <Typography sx={{ cursor: 'pointer' }} onClick={() => { navigate('/settings'); setTabSettings(TabSettings.Tags) }}>
                        <FormattedMessage
                            id="contentMessage.+ Thêm nhãn"
                            defaultMessage="+ Thêm nhãn"
                        />
                    </Typography>
                    <Box sx={{
                        maxHeight: '300px',
                        overflowY: 'scroll',
                    }}>
                        {
                            tags?.filter(tag => tag.isActive)?.map((tag, index) => (
                                <Stack key={index} direction="row" alignItems="center" spacing={1} sx={{
                                    my: 0.5,
                                    cursor: 'pointer',
                                    '&:hover': {
                                        bgcolor: theme.navColor
                                    }
                                }} onClick={() => handleAddTag(tag)}>
                                    <Avatar sx={{ width: 20, height: 20 }} variant="rounded">
                                        <LocalOfferIcon sx={{ bgcolor: tag.colorCode, width: 20, height: 20 }} />
                                    </Avatar>
                                    <Typography variant="body2">
                                        {tag.tagName}
                                    </Typography>
                                </Stack>
                            ))
                        }
                    </Box>
                </Box>
            </Popover>
        </Fragment>
    )
}

export default TagPopover