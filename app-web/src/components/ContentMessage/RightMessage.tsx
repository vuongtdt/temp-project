import React from 'react'
import { Avatar, Box, CardMedia, Stack, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useChatStore } from '../../store/chatStore';
import { MessageModel } from '../../models/messageModel';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CircularProgress from '@mui/material/CircularProgress';
import { formatDate } from '../../helper/helper';
import PhotoIcon from '@mui/icons-material/Photo';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import { FacebookAttachmentType } from 'utils/enum';
type Props = {
  content: MessageModel
}

const RightMessageWrapper = styled(Stack)(() => {
  const { theme } = useChatStore();
  return {
    textAlign: "right",
    '& .MuiTooltip-tooltip': {
      background: 'transparent',
      color: theme.color
    }
  }
});
const RightTextP = styled(Stack)(() => {
  const { theme } = useChatStore();
  return {
    marginTop: '5px',
    width: "fit-content",
    padding: "5px 10px",
    borderRadius: '15px',
    borderBottomRightRadius: "2px",
    textAlign: "right",
    backgroundColor: theme.noteColor,
    color: theme.hoverTextColor
  }
});

const RightMessage = (props: Props) => {
  return (
    <RightMessageWrapper direction="row" justifyContent="flex-end" alignItems="end">
      <Stack alignItems="end">
        {props.content.messageContent &&
          <RightTextP>
            <Tooltip title={formatDate(props.content.messageCreatedTime, 'HH:mm DD-MM')} placement="left-end">
              <Box sx={{wordBreak:'break-all'}}>{props.content.messageContent}</Box>
            </Tooltip>
          </RightTextP>}
        {props.content?.messageFileUrl && props.content?.messageFileType === FacebookAttachmentType.Image && <Tooltip title={formatDate(props.content.messageCreatedTime, 'HH:mm DD-MM')} placement="left-end"><Avatar sx={{ width: 300, height: 300, mt: 0.5 }} variant="rounded" src={props.content.messageFileUrl}>
          <PhotoIcon sx={{ width: 300, height: 300 }} />
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
      </Stack>
      {props.content.isLoading ? <CircularProgress size={20} /> : props.content.isSuccess === false ? <ErrorOutlineOutlinedIcon color="error" sx={{ fontSize: 20 }} /> : <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 20 }} />}
    </RightMessageWrapper>
  )
}

export default RightMessage