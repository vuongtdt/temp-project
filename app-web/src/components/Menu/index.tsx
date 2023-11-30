import React, { useEffect } from 'react'
import { styled } from '@mui/material/styles';
import { useChatStore } from '../../store/chatStore';
import { DarkTheme } from '../../themes/DarkTheme';
import { LightTheme } from '../../themes/LightTheme';
import { Avatar, Box, Stack } from '@mui/material';
import QuestionAnswerOutlinedIcon from '@mui/icons-material/QuestionAnswerOutlined';
import Brightness4OutlinedIcon from '@mui/icons-material/Brightness4Outlined';
import Brightness7OutlinedIcon from '@mui/icons-material/Brightness7Outlined';
import { useTranslateStore } from '../../store/translateStore';
import messages_en from "../../translations/locales/en.json";
import messages_vi from "../../translations/locales/vi.json";
import { useLocalStorage } from '../../lib/component/Hook/useLocalStorage';
import { useNavigate } from 'react-router-dom';
import { useFanpageStore } from '../../store/fanpageStore';
import { apiGetChatGo24 } from '../../helper/apiHelper';
import { useTabMenuStore } from '../../store/tabMenuStore';
import { useSelectConversationStore } from 'store/selectConversationStore';


const MenuWrapper = styled(Stack)(() => {
    const { theme } = useChatStore();
    return {
        width: "70px",
        height: '100%',
        borderRight: `1px solid ${theme.borderColor}`,
        display: `flex`,
    }
});
const TranslateIcon = styled(Avatar)(() => {
    const { theme } = useChatStore();
    return {
        backgroundColor: theme.color,
        color: theme.bgColor,
        width: '34px',
        height: '34px',
        fontSize: '1rem',
    }
});
const MenuChild = styled(Box)(() => {
    const { theme } = useChatStore();
    return {
        padding: '10px 0',
        display: 'flex',
        justifyContent: 'center',
        '&:hover, &.active': {
            backgroundColor: theme.bgColor,
            color: theme.color,
        },
        '&.active': {
            borderLeft: `2px solid ${theme.color}`,
        }
    }
});

type Props = {}


const Menu = (props: Props) => {
    const { theme, changeTheme } = useChatStore();
    const { locale, translate } = useTranslateStore();
    const { tabMenu } = useTabMenuStore();
    const { fanpage, setFanpage } = useFanpageStore();
    const { setItem, getItem } = useLocalStorage();
    const { conversation } = useSelectConversationStore();
    const nagative = useNavigate();
    let userId = conversation?.userId ? conversation?.userId : getItem('fanpageId');

    useEffect(() => {
        apiGetChatGo24('/users/me/pages', rs => {
            if (rs && Array.isArray(rs.data) && rs.data.length > 0) {
                const fanpage = rs.data.find(r => r.userId === userId);
                if (fanpage) {
                    setFanpage(fanpage);
                }
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userId])
    const handleChangeTheme = (theme, name) => {
        changeTheme(theme);
        setItem('theme', name);
    }
    const handleTranslate = () => {
        if (locale === 'vi') {
            translate(messages_en, 'en');
            setItem('locale', 'en');
        } else {
            translate(messages_vi, 'vi');
            setItem('locale', 'vi');
        }
    }
    const handleNavigate = () => {
        nagative('/')
    }
    return (
        <MenuWrapper direction="column" alignItems="center" justifyContent="space-between">
            <Stack sx={{ width: '100%' }}>
                <MenuChild onClick={() => handleNavigate()} className={tabMenu === 0 && 'active'} sx={{ padding: '20px 0 10px 0' }}>
                    <Avatar alt="avatar" src={fanpage.pagePictureUrl} sx={{ width: 38, height: 38 }} />
                </MenuChild>
                <MenuChild onClick={() => {
                    if (userId) {
                        return (nagative(`/message/${userId}`))
                    }
                }} className={tabMenu === 1 && 'active'}>
                    <QuestionAnswerOutlinedIcon sx={{ fontSize: 34 }} />
                </MenuChild>
            </Stack>
            <Stack sx={{ width: '100%' }}>
                <MenuChild sx={{ paddingBottom: '12px' }} onClick={handleTranslate}>
                    {locale === 'vi' ? <TranslateIcon>VI</TranslateIcon> : <TranslateIcon>EN</TranslateIcon>}
                </MenuChild>
                <MenuChild sx={{ paddingBottom: '12px' }}>
                    {theme === LightTheme ?
                        <Brightness7OutlinedIcon onClick={() => handleChangeTheme(DarkTheme, 'DarkTheme')} sx={{ fontSize: 34 }} /> :
                        <Brightness4OutlinedIcon onClick={() => handleChangeTheme(LightTheme, 'LightTheme')} sx={{ fontSize: 34 }} />
                    }
                </MenuChild>
            </Stack>
        </MenuWrapper>
    )
}

export default Menu