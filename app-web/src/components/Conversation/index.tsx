import { IconButton, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useRef, useState } from 'react'
import { useChatStore } from '../../store/chatStore';
import List from '@mui/material/List';
import Avatar from '@mui/material/Avatar';
import { ConversationModel } from '../../models/messageModel';
import { useSelectConversationStore } from '../../store/selectConversationStore';
import { formatDate, parseObjectArrayToParam } from '../../helper/helper';
import { useConversationsStore } from '../../store/conversationsStore';
import { useParams } from 'react-router-dom';
import { useMessageStore } from '../../store/messagesStore';
import { apiGetChatGo24, apiPatchChatGo24 } from '../../helper/apiHelper';
import { Page, TabInfo } from '../../utils/enum';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useTabStore } from '../../store/changeTabStore';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CancelIcon from '@mui/icons-material/Cancel';
import { ChatGo24Repository } from 'repositories/ChatGo24Repository';
import { MessengerIcon } from 'Assets/Images/svg';
type Props = {}
const MessagesWrapper = styled(List)(() => {
    const { theme } = useChatStore();
    return {
        color: theme.color,
        backgroundColor: theme.color1,
        overflowY: 'scroll',
        height: `calc(100% - 110px)`,
    }
});
const MessagesItem = styled(Stack)(() => {
    const { theme } = useChatStore();
    return {
        padding: '16px',
        cursor: 'default',
        '&:hover, &.active': {
            backgroundColor: theme.bgColor,
            color: theme.color,
        },
        'p': {
            color: theme.smallColor,
        }
    }
});
// const MessagesChild = styled(Stack)(() => {
//     return {
//         '& p:nth-of-type(1)': {
//             textOverflow: 'ellipsis',
//             whiteSpace: 'nowrap',
//             width: '240px',
//             overflow: 'hidden',
//             marginRight: 1,
//         },
//         '@media (max-width:1900px)': {
//             '& p:nth-of-type(1)': {
//                 width: '200px',
//             },
//         },
//         '@media (max-width:1700px)': {
//             '& p:nth-of-type(1)': {
//                 width: '150px',
//             },
//         },
//         '@media (max-width:1300px)': {
//             '& p:nth-of-type(1)': {
//                 width: '100px',
//             },
//         },
//         '@media (max-width:1100px)': {
//             '& p:nth-of-type(1)': {
//                 width: '60px',
//             },
//         },
//     }
// });
const Conversation = (props: Props) => {
    const [indexMs, setIndexMs] = useState<number>(0);
    const { filter, conversations, changeConversations, setConversations, unMountConversations } = useConversationsStore();
    const { conversation, setConversation } = useSelectConversationStore();
    let { id } = useParams();
    const { setMessages, setTotalMessage } = useMessageStore();
    const { theme } = useChatStore();
    const latestConversations = useRef<ConversationModel[]>();
    const filterChat = useRef(null);
    const [pageIndex, setPageIndex] = useState(1);
    const { changeTab } = useTabStore();
    filterChat.current = filter;
    latestConversations.current = conversations;
    let userId = conversation?.userId ? conversation?.userId : id;

    useEffect(() => {
        return () => {
            setConversation(null);
            unMountConversations();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        if (!latestConversations.current || latestConversations.current.length === 0) return;
        const params = parseObjectArrayToParam(filterChat.current);
        let url = filterChat.current?.userId?.length > 0 ? `/users/me/pages/conversations?pageIndex=${pageIndex}&pageSize=${Page.PageSize}&${params}` : `/users/me/pages/${userId}/conversations?pageIndex=${pageIndex}&pageSize=${Page.PageSize}&${params}`;
        apiGetChatGo24(url, res => {
            if (res?.data) {
                setConversations(res?.data);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageIndex])
    const handleChangeConversation = (con: ConversationModel, index) => {
        if (con) {
            setIndexMs(index);
            userId = con.userId;
            setConversation(con);
            changeTab(TabInfo.Info);
            ChatGo24Repository.FetchConversation(userId, con.id);
            apiGetChatGo24(`/users/me/pages/${userId}/conversations/${con.id}/messages?pageIndex=${pageIndex}&pageSize=${Page.PageSize}&sortType=desc`, res2 => {
                if (res2?.data) {
                    setMessages(res2.data);
                    setTotalMessage(!!res2.data.length ? Number(res2.data.length) : 0);
                }
            });
            if (con.hasRead) return;
            apiPatchChatGo24(`/users/me/pages/${userId}/conversations/${con.id}`, { hasRead: true }, (rs) => {
                if (rs?.data) {
                    handleSetConversations(userId, con.id, true);
                }
            })
        }
    }
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
                        conversationUpdatedTime: res1.data?.conversationUpdatedTime

                    }
                } else {
                    updateConversations.push(res1?.data)
                }
                changeConversations(updateConversations);
            }
        });
    }
    const removeTag = async (conversation: ConversationModel, name) => {
        let index: number = conversation.tags.findIndex(t => name === t.tagName);
        if (index < 0) return;
        await ChatGo24Repository.UpdateConversation(conversation?.userId, conversation.id, { userTags: [conversation.tags[index]], isRemoveTags: true });
        let _conversations: any = latestConversations.current?.map((con) => {
            if (con.id === conversation?.id) {
                if (index > -1) {
                    con.tags.splice(index, 1);
                }
            }
            return con;
        });
        changeConversations(_conversations);
    }
    const compareDateTime = (dateTime: string): string => {
        let d1 = new Date(dateTime);
        d1.setHours(0, 0, 0, 0);
        let now = new Date();
        now.setHours(0, 0, 0, 0);
        if (d1 >= now) {
            return formatDate(dateTime, 'HH:mm');
        }
        return formatDate(dateTime, 'DD/MM/YY');
    }
    return (
        <Stack
            id='stack-content' sx={{
                overflowY: 'auto',
                maxHeight: '84vh',
                '@media (max-width:1700px)': {
                    maxHeight: '76vh',
                },
                '@media (max-width:1300px)': {
                    maxHeight: '69vh'
                },
                '@media (max-width:1100px)': {
                    maxHeight: '62vh'
                },
            }}
        >
            <InfiniteScroll
                dataLength={conversations?.length as number}
                next={() => setPageIndex((prev) => prev + 1)}
                hasMore={(conversations?.length as number) >= pageIndex * Page.PageSize}
                loader={<h4>Loading...</h4>}
                style={{ display: 'flex', flexDirection: 'column', overflow: 'unset' }}
                scrollableTarget="stack-content"
            >
                <MessagesWrapper disablePadding={true}>{
                    conversations?.map((con, index) => <MessagesItem key={index} onClick={() => handleChangeConversation(con, index)} className={index === indexMs && `active`}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                            <Stack direction="row" alignItems="center">
                                <Avatar src={con.sentTo?.picture} sx={{ width: 40, height: 40, mr: 1 }}>
                                </Avatar>
                                <Stack maxWidth="200px" textOverflow="hidden">
                                    <Typography 
                                        sx={{ 
                                            fontWeight: 500,
                                            display: '-webkit-box',
                                            overflow: 'hidden',
                                            height: '1.75rem',
                                            WebkitLineClamp: 1,
                                            WebkitBoxOrient: 'vertical'
                                        }}
                                        variant="subtitle1"
                                        >{con.sentTo?.userName}</Typography>
                                    <Typography variant="body2"
                                        sx={{
                                            fontWeight: !con?.hasRead ? 600 : 400,
                                            color: !con?.hasRead ? `${theme.color} !important` : 'initial',
                                        }} >{con?.lastMessage ? con?.lastMessage : '--'}
                                    </Typography>
                                </Stack>
                            </Stack>
                            <Stack>
                                {/* <MessagesChild direction="row" justifyContent="space-between" alignItems="center">
                                </MessagesChild> */}
                                <Stack maxHeight="1.75rem">
                                    <MessengerIcon />
                                </Stack>
                                <Typography sx={{
                                    fontWeight: !con?.hasRead ? 600 : 400,
                                    color: !con?.hasRead ? `${theme.color} !important` : 'initial',
                                }} variant="body2">
                                    {compareDateTime(con.conversationUpdatedTime)}
                                </Typography>
                            </Stack>
                        </Stack>
                        <Stack direction="row">{con?.tags?.map((tag, index) => index < 3 && <Stack key={tag.tagName + index} direction="row" spacing={0.2} sx={{ mr: 1, mt: 0.5, position: 'relative' }}>
                            <IconButton
                                onClick={() => removeTag(con, tag.tagName)}
                                sx={{
                                    position: 'absolute',
                                    right: -16,
                                    top: -14,
                                    zIndex: 1
                                }}>
                                <CancelIcon sx={{ fontSize: 12 }}
                                />
                            </IconButton>
                            <Avatar sx={{ width: 20, height: 20 }} variant="rounded">
                                <LocalOfferIcon sx={{ bgcolor: tag.colorCode, width: 20, height: 20 }} />
                            </Avatar>
                            <Typography variant="body2">
                                {tag.tagName}
                            </Typography>
                        </Stack>
                        )}
                            {con?.tags?.length > 3 && <>...</>}
                        </Stack>
                    </MessagesItem>)
                }
                </MessagesWrapper>
            </InfiniteScroll>
        </Stack>
    )
}

export default Conversation