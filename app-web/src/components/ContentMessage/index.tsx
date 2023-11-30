import { Avatar, Box, IconButton, InputAdornment, ListItem, ListItemAvatar, ListItemIcon, ListItemText, Popover, Stack, TextField, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { Fragment, useEffect, useRef, useState, ChangeEvent } from 'react'
import { useChatStore } from '../../store/chatStore';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import translate from '../../translations';
import DirectionsIcon from '@mui/icons-material/Directions';
import RightMessage from './RightMessage';
import LeftMessage from './LeftMessage';
import { useSelectConversationStore } from '../../store/selectConversationStore';
import { useMessageStore } from '../../store/messagesStore';
import { useParams } from 'react-router-dom';
import { useLocalStorage } from '../../lib/component/Hook/useLocalStorage';
import { useAlertStore } from '../../store/alertStore';
import { apiGetChatGo24, apiPatchChatGo24, apiPostChatGo24 } from '../../helper/apiHelper';
import config from '../../config';
import { ConversationModel, MessageModel } from '../../models/messageModel';
import { useFanpageStore } from '../../store/fanpageStore';
import InfiniteScroll from "react-infinite-scroll-component";
import { FacebookAttachmentType, Page } from '../../utils/enum';
import { useConversationsStore } from '../../store/conversationsStore';
import { formatDate, toBase64 } from '../../helper/helper';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { v4 as uuidv4 } from 'uuid';
import Picker from '../InputMessage/EmojiPicker';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import CancelIcon from '@mui/icons-material/Cancel';
import TagPopover from './TagPopover';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import { useConnectionStore } from 'store/connectionStore';
import { LOGIN_URL } from 'models/constants';
import Search from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
type Props = {
}
const ContentMessageWrapper = styled(Stack)(() => {
    const { theme } = useChatStore();
    return {
        padding: '10px 0',
        height: '92vh',
        borderRadius: '20px',
        margin: '20px 10px',
        background: theme.color1,
        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.15)'
    }
});
const HeaderWrapper = styled(Stack)(() => {
    const { theme } = useChatStore();
    return {
        borderBottom: `1px solid ${theme.borderColor}`,
        margin: '0 20px',
    }
});
const BodyWrapper = styled(Stack)(() => {
    return {
        height: '100%'
    }
});

const ChatBox = styled(TextField)(() => {
    const { theme } = useChatStore();
    return {
        color: theme.color,
        width: '100%',
        '.MuiInputBase-formControl': {
            borderRadius: '20px',
            color: theme.color,
        },
        'button': {
            color: theme.color,

        },
        'label': {
            color: 'inherit',
        },
        '.css-dpjnhs-MuiInputBase-root-MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'inherit',
        },
        'fieldset': {
            borderColor: 'inherit',
        },
        '.css-1sumxir-MuiFormLabel-root-MuiInputLabel-root.Mui-focused': {
            color: 'inherit',
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
    }
});

interface ImageModel {
    id: string;
    name: string,
    base64Files: string,
    urlImage: string,
}

const ContentMessage = (props: Props) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const { theme } = useChatStore();
    const [value, setValue] = useState('');
    const { conversation } = useSelectConversationStore();
    const { messages, setMessages, totalMessage, setTotalMessage } = useMessageStore();
    const { id } = useParams();
    const { getItem } = useLocalStorage();
    const latestChat = useRef(null);
    const latestConversation = useRef<ConversationModel>();
    const latestConversations = useRef<ConversationModel[]>();
    const filterChat = useRef(null);
    const { setConnection } = useConnectionStore();
    const { fanpage } = useFanpageStore();
    const [pageIndex, setPageIndex] = useState(1);
    const { filter, conversations, changeConversations, unMountConversations } = useConversationsStore();
    const imageInputRef = useRef<HTMLInputElement>(null);
    const [images, setImages] = useState<ImageModel[]>([]);
    const [isReconnect, setIsReconnect] = useState(false);
    const [reconnectBoxPosition, setReconnectBoxPosition] = useState(0);
    const chatBoxRef = React.useRef<HTMLDivElement>(null);
    const { setIsOpenAlert, setAlert, setType } = useAlertStore();
    const connectionRef = useRef<any>();
    latestChat.current = Object.keys(messages).map((key) => messages[key]);
    latestConversation.current = conversation;
    latestConversations.current = conversations;
    filterChat.current = filter;
    const open = Boolean(anchorEl);
    const idPopover = open ? 'items-popover' : undefined;
    let userId = conversation?.userId ? conversation?.userId : id;

    useEffect(() => {
        connectionRef.current = new HubConnectionBuilder().withUrl(`${config.baseUrl}/hubs/facebook?accessToken=${getItem('accessToken')}`).withAutomaticReconnect().build();
        connectionRef.current.onreconnecting(() => {          
            setIsReconnect(true);
        });
        connectionRef.current.onreconnected(() => {
            setIsReconnect(false);
        });
        setConnection(connectionRef.current);

        /** Detect position of chatbox */
        if (chatBoxRef) {
            setReconnectBoxPosition(chatBoxRef.current.offsetTop + 20);
        }

        return (() => {
            connectionRef.current.stop();
            latestChat.current = [];
            unMountConversations();
            setMessages([]);
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (connectionRef.current) {
            connectionRef.current.start()
                .then(result => {
                    connectionRef.current.on('OnFacebookMessaging', (userId, conversationId, messageId, tempId, isSuccess) => {
                        if (userId && conversationId && messageId) {
                            apiGetChatGo24(`/users/me/pages/${userId}/conversations/${conversationId}/messages/${messageId}`, rs => {
                                if (rs?.data) {
                                    if (conversationId === latestConversation.current.id && userId === latestConversation.current.userId) {
                                        const updatedChat = [...latestChat.current];
                                        const index = updatedChat.findIndex(mes => tempId === mes.tempId);
                                        if (index > - 1) {
                                            updatedChat[index] = {
                                                ...updatedChat[index],
                                                baseUserId: rs.data.baseUserId,
                                                isLoading: false,
                                                messageCreatedTime: rs.data.messageCreatedTime,
                                                isSuccess
                                            }
                                            setMessages(updatedChat);
                                            handleSetConversations(userId, conversationId, true);
                                        } else if (rs?.data?.sentFrom?.userId === latestConversation.current?.sentTo?.userId) {
                                            const updatedChat = [...latestChat.current];
                                            updatedChat.unshift(rs?.data);
                                            setMessages(updatedChat);
                                            handleSetConversations(userId, conversationId, true);
                                        } else {
                                            apiGetChatGo24(`/users/me/pages/${userId}/conversations/${conversationId}/messages?pageIndex=${pageIndex}&pageSize=${Page.PageSize}&sortType=desc`, res2 => {
                                                if (res2?.data) {
                                                    setMessages(res2.data);
                                                }
                                            });
                                        }
                                    } else {
                                        handleSetConversations(userId, conversationId, false);
                                    }
                                }
                            });
                        }
                        else if (!messageId && tempId && conversationId && userId) {
                            if (conversationId === latestConversation.current.id) {
                                const updatedChat = [...latestChat.current];
                                const index = updatedChat.findIndex(mes => tempId === mes.tempId);
                                if (index > - 1) {
                                    updatedChat[index] = {
                                        ...updatedChat[index],
                                        isLoading: false,
                                        isSuccess
                                    }
                                    setMessages(updatedChat);
                                    handleSetConversations(userId, conversationId, true);
                                }
                            }
                        }

                    });
                    connectionRef.current.on('OnSyncMessagesProcess', (userId, conversationId) => {
                        if (userId && conversationId) {
                            handleSetConversations(userId, conversationId, false);
                        }
                    })
                })
                .catch(e => {
                    if (e.message !== "Cannot start a HubConnection that is not in the 'Disconnected' state.") {
                        setAlert(`Connection failed: ${e}`);
                        setIsOpenAlert(true);
                        window.location.href = LOGIN_URL;
                    }
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [connectionRef.current]);

    useEffect(() => {
        if (!latestChat.current || latestChat.current.length === 0) return;
        apiGetChatGo24(`/users/me/pages/${userId}/conversations/${conversation?.id}/messages?pageIndex=${pageIndex}&pageSize=${Page.PageSize}&sortType=desc`, res => {
            if (res?.data) {
                let updatedChat = [...latestChat.current];
                updatedChat = updatedChat.concat(res.data);
                if (pageIndex !== 1) {
                    setTotalMessage(totalMessage + Number(res.data.length));
                } else {    
                    setTotalMessage(!!res.data.length ? Number(res.data.length) : 0);
                }
                setMessages(updatedChat);
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageIndex])
    useEffect(() => {
        setPageIndex(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conversation])
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event?.target;
        setValue(value);
    };
    const handleSetConversations = (userId: string, conversationId: string, hasRead: boolean) => {
        apiGetChatGo24(`/users/me/pages/${userId}/conversations/${conversationId}`, res1 => {
            if (res1?.data) {
                const updateConversations = [...latestConversations.current];
                const index = updateConversations.findIndex(con => con.id === res1?.data.id)
                if (index > -1) {
                    updateConversations[index] = {
                        ...updateConversations[index],
                        lastMessage: res1.data?.lastMessage,
                        hasRead,
                        conversationUpdatedTime: res1?.data.conversationUpdatedTime
                    }
                } else {
                    updateConversations.push(res1?.data)
                }
                changeConversations(updateConversations);
            }
        });

    }
    const postMessage = (value?: string, image?: ImageModel, type?: string) => {
        const tempId = image?.id ? image?.id : uuidv4();
        if (value) setValue('');
        if (image) setImages([]);
        const message: MessageModel = {
            baseUserId: '',
            userId: fanpage.userId,
            messageCreatedTime: new Date().toISOString(),
            sentFrom: {
                picture: fanpage.pagePictureUrl,
                userName: fanpage.pageName,
                userEmail: '',
                userId: fanpage.userId,
            },
            messageFileUrl: image?.urlImage,
            messageFileType: type,
            messageContent: value,
            isLoading: true,
            tempId,
        };
        const updatedChat = [...latestChat.current];
        updatedChat.unshift(message);
        setMessages(updatedChat);
        latestChat.current = [...updatedChat];
        setTotalMessage(totalMessage + 1);
        apiPostChatGo24(`/users/me/pages/${userId}/conversations/${conversation.id}/messages`, {
            messageText: value,
            base64Filess: [{
                id: image?.id,
                name: image?.name,
                data: image?.base64Files
            }],
            tempId,
        }, (rs) => {
            if (!rs.data?.isSuccess && rs.data?.errorMessage) {
                setAlert(rs.data?.errorMessage);
                setType('error');
                setIsOpenAlert(true);
                // if (rs.data.errorMessage === "(#10) Tin nhắn này được gửi ngoài khoảng thời gian cho phép. Tìm hiểu thêm về chính sách mới tại đây: https://developers.facebook.com/docs/messenger-platform/policy-overview") {
                //     setBlockChat(true);
                // }
            }
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (Array.isArray(images) && images.length > 0) {
            images.map(image => {
                postMessage('', image, FacebookAttachmentType.Image);
                return image;
            })
        }
        if (value) {
            const checkSpace = value.trim().length === 0;
            checkSpace ? setValue('') : postMessage(value);
        }
        scrollToBottom('box-content');
    }
    const scrollToBottom = (id) => {
        const element = document.getElementById(id);
        element.scrollTop = element.scrollHeight;
        element.style.scrollBehavior = "smooth";
    }
    const handleFocus = () => {
        if (conversation.hasRead) return;
        apiPatchChatGo24(`/users/me/pages/${userId}/conversations/${conversation.id}`, { hasRead: true }, (rs) => {
            if (rs?.data) {
                handleSetConversations(userId, conversation.id, true);
            }
        })
    }
    const addIconToInput = (emoji: string) => {
        const _value = value + emoji;
        setValue(_value);
        handleClose();
        setTimeout(() => {
            document.getElementById("outlined-multiline-flexible").focus();
        }, 300);
    };
    const handleOpenEmoji = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    }
    const handleFileInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
        setTimeout(() => {
            document.getElementById("outlined-multiline-flexible").focus();
        }, 300);
        const file = e.target.files?.[0];
        e.target.value = null;
        let type = file && file?.type.split('/')[0];
        const base64 = await toBase64(file);
        const _file = {
            id: uuidv4(),
            name: file.name,
            base64Files: base64.toString(),
            urlImage: URL.createObjectURL(file),
        } as ImageModel;
        if (file && type === FacebookAttachmentType.Image) {
            const _images = [...images, _file];
            setImages(_images);
        } else {
            postMessage('', _file, type);
        }

    }
    const removeImage = (imageId) => {
        let _images = images.filter(img => img.id !== imageId);
        setImages(_images);
    }
    const handleAddTag = (tag) => {
        let _conversations = latestConversations.current?.map(con => {
            if (con.id === conversation?.id) {
                const index = con.tags.findIndex(t => tag.tagName === t.tagName);
                if (index < 0) con.tags.push(tag);
            }
            return con;
        });
        changeConversations(_conversations);
    }
    return (
        <ContentMessageWrapper direction="column">
            <HeaderWrapper direction="row" alignItems="center" justifyContent="spac-between">
                <ListItem sx={{ px: 0}}>
                    <ListItemAvatar>
                        <Avatar src={conversation?.sentTo?.picture}>
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText sx={{
                        '& span': { fontWeight: 500 },
                        '& p': {
                            color: `${theme.smallColor} !important`
                        }
                    }} primary={conversation?.sentTo?.userName} secondary={conversation?.sentTo?.userEmail} />
                    <ListItemIcon sx={{justifyContent: 'right'}}><Search sx={{ fontSize: '2rem', width: '2rem', height: '2rem', cursor: 'pointer' }} /></ListItemIcon>
                </ListItem>
                {conversation?.lastUserResponseTime && <Tooltip title={`${translate('message.Thời hạn trả lời tin nhắn đến','Thời hạn trả lời tin nhắn đến')} ${formatDate(conversation?.lastUserResponseTime)}`} placement="left-end">
                    <ErrorOutlineOutlinedIcon />
                </Tooltip>}

            </HeaderWrapper>
            <BodyWrapper direction="column" justifyContent="flex-end" ref={chatBoxRef}>
                <Stack id='box-content' sx={{
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    maxHeight: '76vh',
                    flexDirection: 'column-reverse',
                    '@media (max-width:1700px)': {
                        maxHeight: '70vh',
                    },
                    '@media (max-width:1300px)': {
                        maxHeight: '62vh',
                    },
                    '@media (max-width:1100px)': {
                        maxHeight: '56vh',
                    }

                }}>
                    {isReconnect && (
                        <Box
                        sx={{
                            position: "fixed",
                            background: theme.bgColor,
                            width: '100%',
                            padding: '5px 10px',
                        }}
                        style={{
                            top: `${reconnectBoxPosition}px`,
                        }}
                        >
                        {translate(
                            "message.Bạn đã bị mất kết nối, đang kết nối lại...",
                            "Bạn đã bị mất kết nối, đang kết nối lại..."
                        )}
                        </Box>
                    )}
                    <InfiniteScroll
                        dataLength={totalMessage}
                        next={() => setPageIndex((prev) => prev + 1)}
                        inverse
                        hasMore={totalMessage >= pageIndex * Page.PageSize}
                        loader={<h4>Loading...</h4>}
                        style={{ display: 'flex', flexDirection: 'column-reverse', margin: '20px', overflow: 'unset' }}
                        scrollableTarget="box-content"
                    >
                        {latestChat.current?.map((content, index) => (
                            <Fragment key={index}>
                                {content.sentFrom.userId === userId ? <RightMessage content={content} /> : <LeftMessage content={content} />}
                            </Fragment>
                        ))}
                    </InfiniteScroll>
                </Stack>
                {latestChat.current?.length > 0 && !latestChat.current[0].isExpried ?
                    <Box noValidate onSubmit={handleSubmit}
                        autoComplete="off" component="form" sx={{ px: 3, py: 1, display: 'inline-block', mb: 1 }}>
                        <ChatBox
                            id="outlined-multiline-flexible"
                            placeholder={translate('message.Nhập tin nhắn...', 'Nhập tin nhắn...')}
                            // multiline
                            maxRows={4}
                            value={value}
                            onChange={handleChange}
                            onFocus={handleFocus}
                            InputProps={{
                                startAdornment: (<>
                                    <InputAdornment position="start">
                                        <TagPopover addTag={handleAddTag} />
                                        <IconButton sx={{ p: '5px' }} aria-label="update-file" onClick={() => imageInputRef.current?.click()}>
                                            <AttachFileOutlinedIcon />
                                        </IconButton>
                                        <input
                                            ref={imageInputRef}
                                            hidden
                                            className="hidden"
                                            type="file"
                                            accept="image"
                                            onChange={handleFileInputChange}
                                        />
                                    </InputAdornment>
                                    {images?.map((img: any, index: number) => (
                                        <Box sx={{
                                            position: 'relative',
                                            padding: 1,
                                        }} key={index}>
                                            <IconButton
                                                onClick={() => removeImage(img.id)}
                                                sx={{
                                                    position: 'absolute',
                                                    right: 0,
                                                    top: 0,
                                                    zIndex: 1
                                                }}>
                                                <CancelIcon sx={{ fontSize: 12 }}
                                                />
                                            </IconButton>

                                            <Avatar src={img?.urlImage} variant="rounded" sx={{ width: 55, height: 55 }}>
                                            </Avatar>
                                        </Box>
                                    ))}
                                </>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton sx={{ p: '5px' }} aria-label="directions"
                                            onClick={handleOpenEmoji}
                                            aria-describedby={idPopover}
                                        >
                                            <EmojiEmotionsIcon sx={{color: theme.textColor}}/>
                                        </IconButton>
                                        <Popover
                                            id={idPopover}
                                            open={open}
                                            anchorEl={anchorEl}
                                            onClose={handleClose}
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'center',
                                            }}
                                            transformOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'left',
                                            }}
                                        >
                                            {open && <Picker
                                                onEmojiSelect={(emoji: any) => addIconToInput(emoji.native)}
                                            />}
                                        </Popover>
                                        <IconButton type="submit" sx={{ p: '10px' }} aria-label="directions">
                                            <SendIcon sx={{color: theme.mainColor, transform: 'rotateZ(-35deg)'}}/>
                                        </IconButton>
                                    </InputAdornment>

                                ),
                            }}
                        />
                    </Box> : <Stack alignItems="center" direction="row" justifyContent="space-between" spacing={2} sx={{
                        p: 2,
                        bgcolor: theme.bgColor,
                    }}>
                        <WarningAmberIcon color="warning" />
                        <Box>
                            {translate('content.Đã hết thời hạn gửi tin nhắn cho khách hàng không tương tác với trang theo điều khoản của Facebook: ', 'Đã hết thời hạn gửi tin nhắn cho khách hàng không tương tác với trang theo điều khoản của Facebook: ')}
                            <a href="https://developers.facebook.com/docs/messenger-platform/policy-overview">https://developers.facebook.com/docs/messenger-platform/policy-overview</a>
                        </Box>
                    </Stack>}

            </BodyWrapper>
        </ContentMessageWrapper >
    )
}

export default ContentMessage