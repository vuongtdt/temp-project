import React from 'react'
import { Avatar, Box, CardMedia, Stack, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useChatStore } from '../../store/chatStore';
import { MessageModel } from '../../models/messageModel';
import { formatDate } from '../../helper/helper';
import { FacebookAttachmentType } from 'utils/enum';

type Props = {
    content: MessageModel
}

const LeftMessageWrapper = styled(Stack)(() => {
    const { theme } = useChatStore();
    return {
        '& .MuiTooltip-tooltip': {
            background: 'transparent',
            color: theme.color
        }
    }
});

const LeftTextP = styled(Stack)(() => {
    const { theme } = useChatStore();
    return {
        marginTop: '5px',
        width: "fit-content",
        padding: "5px 10px",
        borderRadius: '15px',
        borderBottomLeftRadius: "2px",
        backgroundColor: theme.bgColor,
    }
});

const LeftMessage = (props: Props) => {
    return (
        <LeftMessageWrapper>
            {props.content.messageContent &&
                <LeftTextP>
                    <Tooltip title={formatDate(props.content.messageCreatedTime, 'HH:mm DD-MM')} placement="right-end">
                        <Box sx={{wordBreak:'break-all'}}>
                            {props.content.messageContent}
                        </Box>
                    </Tooltip>
                </LeftTextP>
            }
            {props.content?.messageFileUrl && props.content?.messageFileType === FacebookAttachmentType.Image &&
                <Tooltip title={formatDate(props.content.messageCreatedTime, 'HH:mm DD-MM')} placement="right-end">
                    <Avatar sx={{ width: 300, height: 300, mt: 0.5 }} variant="rounded" src={props.content.messageFileUrl}>
                    </Avatar>
                </Tooltip>}
            {props.content?.messageFileUrl && props.content?.messageFileType !== FacebookAttachmentType.Image && <Tooltip title={formatDate(props.content.messageCreatedTime, 'HH:mm DD-MM')} placement="left-end">
                <CardMedia
                    sx={{ width: 300, height: 300, mt: 0.5 }}
                    component={props.content?.messageFileType as any}
                    src={props.content.messageFileUrl}
                    title="file_title"
                    autoPlay={props.content?.messageFileType === FacebookAttachmentType.Video ? true : false}
                    controls={props.content?.messageFileType === FacebookAttachmentType.Video ? true : false}
                />
            </Tooltip>}
        </LeftMessageWrapper>
    )
}

export default LeftMessage