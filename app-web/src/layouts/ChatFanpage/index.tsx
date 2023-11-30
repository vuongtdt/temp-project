import React, { useEffect, useRef, useState } from 'react'
import MenuFilter from '../../components/MenuFilter'
import { styled } from '@mui/material/styles'
import { useChatStore } from '../../store/chatStore'
import { Avatar, Grid, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import Filter from '../../components/Filter'
import Messages from '../../components/Conversation'
import ContentMessage from '../../components/ContentMessage'
import MenuInfo from '../../components/MenuInfo'
import InfoOrder from '../../components/InfoOrder'
import { useConversationsStore } from '../../store/conversationsStore'
import { useTabMenuStore } from '../../store/tabMenuStore'
import Label from 'components/Label'
import translate from 'translations'
import { useTabStore } from 'store/tabStore'
import { useFanpageStore } from 'store/fanpageStore'
import { apiGetChatGo24 } from 'helper/apiHelper'
import { useLocalStorage } from 'lib/component/Hook/useLocalStorage'
import { useFanpagesStore } from 'store/fanpagesStore'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelectConversationStore } from 'store/selectConversationStore'
import { ButtonRS } from 'components/re-skin'
import { PageName } from 'utils/enum'
import { stringAvatar } from 'helper/helper'

type Props = {}
const ChatFanpageWrapper = styled(Stack)(() => {
    return {
        height: '100%',
        width: '100%',
    }
});
const MessagesWrapper = styled(Grid)(() => {
    const { theme } = useChatStore();
    return {
        borderRight: `1px solid ${theme.borderColor}`,
        height: '100%',
        backgroundColor: theme.color1,
    }
});
const ContentWrapper = styled(Grid)(() => {
    const { theme } = useChatStore();
    return {
        borderRight: `1px solid ${theme.borderColor}`,
        height: '100%',
    }
});
const MenuChild = styled(ButtonRS)(() => {
    const { theme } = useChatStore();
    return {
        padding: '0 10px',
        '&.active': {
            backgroundColor: theme.textColor,
            color: theme.mainColor,
        },
    }
});
const Text = styled(Typography)(() => {
    const { theme } = useChatStore();
    return {
        color: theme.color2,
        margin: '0px',
    }
});
const ChatFanpage = (props: Props) => {
    const { filter, conversations, unMountConversations } = useConversationsStore();
    const { setTabMenu } = useTabMenuStore();
    const { theme } = useChatStore();
    const { tab } = useTabStore();
    const { fanpage, setFanpage } = useFanpageStore();
    const { getItem } = useLocalStorage();
    const { fanpages, setFanpages } = useFanpagesStore();
    const { setItem } = useLocalStorage();
    const navigate = useNavigate();
    let { id } = useParams();
    const lastConversations = useRef(null);
    lastConversations.current = conversations;
    const [pages, setPages] = useState<any>([]);
    const { conversation } = useSelectConversationStore();
    let userId = conversation?.userId ? conversation?.userId : getItem('fanpageId');

    useEffect(() => {
        setTabMenu(1);
        return (() => {
            unMountConversations();
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        if (filter?.userId?.length > 0 && fanpages?.length > 0) {
            let _pages = [];
            filter.userId.map(userId => {
                let _page = fanpages.find(p => p.userId === userId)
                if (_page) _pages.push(_page);
                return userId;
            })
            setPages(_pages);
        } else setPages([]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter])
    useEffect(() => {
        apiGetChatGo24('/users/me/pages', rs => {
            if (rs && Array.isArray(rs.data) && rs.data.length > 0) {
                setFanpages(rs.data);
                const fanpage = rs.data.find(r => r.userId === userId);
                if (fanpage) {
                    setFanpage(fanpage);
                }
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId])
    const handleChangeFanpage = (userId: string) => {
        setItem('fanpageId', userId);
        navigate(`/message/${userId}`, { replace: false });
        if (id !== userId) window.location.reload();
    }
    return (
        <Stack sx={{ width: "100%" }}>
            <ChatFanpageWrapper direction="row" sx={{ borderBottom: `1px solid ${theme.borderColor2}`, height: 50 }}>
                <Grid container sx={{ background: 'linear-gradient(#64329a, #5a2d8d)' }}>
                    <Grid item xs={2.7} sx={{
                        borderRight: `1px solid ${theme.borderColor2}`,
                    }}>
                        <Label name={PageName.Messages.toString()} />
                    </Grid>
                    <Grid direction="column" container item xl={5.5} md={5.2} alignItems="center" >
                        <Stack direction="row" sx={{
                            width: '100%', height: '100%',
                            pl: 5,
                            borderRight: `1px solid ${theme.borderColor2}`,

                        }} alignItems="center" >
                            <MenuChild className={tab === 0 && 'active'} sx={{ mr: 2 }}>
                                {translate('chatfanpage.Hộp thoại', 'Hộp thoại')}
                            </MenuChild>
                            <MenuChild onClick={() => navigate('/settings')}>
                                {translate('chatfanpage.Cài đặt', 'Cài đặt')}
                            </MenuChild>
                        </Stack>
                    </Grid>
                    <Grid container item xl={3.8} md={4.1} justifyContent="end" alignItems="center" >
                        {pages?.length > 0 ?
                            <>
                                <Stack direction="row" justifyContent="center" alignItems="center" sx={{ borderRight: `1px solid ${theme.borderColor}`, pr: 1 }}>
                                    {pages?.map(page => (
                                        <Tooltip key={page.userId} title={page.pageName || '--'} placement="bottom">
                                            <IconButton>
                                                <Avatar alt="avatar" src={page.pagePictureUrl} sx={{ width: 32, height: 32 }} >
                                                    <Avatar {...stringAvatar(page?.pageName)} />
                                                </Avatar>
                                            </IconButton>
                                        </Tooltip>
                                    ))}
                                </Stack>
                                <Text className="text-truncate" sx={{ fontWeight: 400, color: theme.navColor, maxWidth: 180, px: 2 }} variant="subtitle1" >
                                    {translate('chatfanpage.Chế độ gộp', 'Chế độ gộp')} <b>{pages?.length}</b> {translate('chatfanpage.trang', 'trang')}
                                </Text>
                            </> :
                            <>
                                <Stack direction="row" justifyContent="center" alignItems="center" sx={{ borderRight: `1px solid ${theme.borderColor}`, pr: 1 }}>
                                    {fanpages?.map(page => (
                                        <Tooltip key={page.userId} title={page.pageName || '--'} placement="bottom">
                                            <IconButton onClick={() => handleChangeFanpage(page.userId)}>
                                                <Avatar alt="avatar" src={page.pagePictureUrl} sx={{ width: 32, height: 32 }} ><Avatar {...stringAvatar(page?.pageName)} />
                                                </Avatar>
                                            </IconButton>
                                        </Tooltip>
                                    ))}
                                </Stack>
                                <Tooltip title={fanpage.pageName || '--'} placement="bottom">
                                    <Stack direction="row" justifyContent="end" alignItems="center" sx={{ px: 2 }}>
                                        <Avatar alt="avatar" src={fanpage.pagePictureUrl} sx={{ width: 38, height: 38, mr: 1 }} >
                                            <Avatar {...stringAvatar(fanpage?.pageName)} />
                                        </Avatar>
                                        <Text className="text-truncate" sx={{ fontWeight: 400, color: theme.navColor, maxWidth: 150 }} variant="subtitle1" >
                                            - {fanpage.pageName}
                                        </Text>
                                    </Stack>
                                </Tooltip>
                            </>}
                    </Grid>
                </Grid>
            </ChatFanpageWrapper>
            <ChatFanpageWrapper direction="row">
                <Grid container>
                    <Grid item xs={0.5}>
                        <MenuFilter />
                    </Grid>
                    <MessagesWrapper flexWrap="nowrap" direction="column" container item xs={2.5} sx={{background: theme.bgColor1, border: 'none'}}>
                        <Stack sx={{borderRadius: '20px', margin: '20px 10px 20px 20px', overflow: 'hidden', height: '100%', background: theme.color1, boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.15)'}}>
                            <Filter />
                            <Messages />
                        </Stack>
                    </MessagesWrapper>
                    <ContentWrapper item xl={5} md={5} sx={{ background: theme.bgColor1, border: 'none' }}>
                        <ContentMessage />
                    </ContentWrapper>
                    <Grid container item xl={3.5} md={3.5} sx={{ position: 'relative', background: theme.bgColor1 }}>
                        <Stack sx={{ width: '100%', height: '95.5vh'}}>
                            <InfoOrder />
                        </Stack>
                    </Grid>
                    <Grid item xs={0.5}>
                        <MenuInfo />
                    </Grid>
                </Grid>
            </ChatFanpageWrapper>
        </Stack >
    )
}

export default ChatFanpage