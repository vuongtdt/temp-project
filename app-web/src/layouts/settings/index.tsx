import { Avatar, Button, Divider, Grid, Stack, styled, Typography } from '@mui/material'
import { useChatStore } from 'store/chatStore';
import { FormattedMessage } from 'react-intl';
import Label from 'components/Label';
import { useEffect } from 'react';
import { PageName, TabSettings } from 'utils/enum';
import General from 'components/Settings/General';
import Tags from 'components/Settings/Tags';
import { useFanpageStore } from 'store/fanpageStore';
import { useLocalStorage } from 'lib/component/Hook/useLocalStorage';
import { apiGetChatGo24 } from 'helper/apiHelper';
import { useFanpagesStore } from 'store/fanpagesStore';
import { useNavigate } from 'react-router-dom';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import { useTabSettingsStore } from 'store/tabSettingsStore';
import SettingsIcon from 'Assets/Images/re-skin/SettingsIcon.png';
import TagsIcon from 'Assets/Images/re-skin/TagsIcon.png';

const StackWrapper = styled(Stack)(() => {
    const { theme } = useChatStore();
    return {
        padding: '14px',
        cursor: 'pointer',
        '&:hover, &.active': {
            background: theme.textColor,
        }
    }
})
const Text = styled(Typography)(() => {
    const { theme } = useChatStore();
    return {
        color: theme.color2,
        margin: '0px',
    }
});
const Settings = () => {
    const { theme } = useChatStore();
    const { fanpage, setFanpage } = useFanpageStore();
    const { setFanpages } = useFanpagesStore();
    let navigate = useNavigate();
    const { tabSettings, setTabSettings } = useTabSettingsStore();
    const { getItem } = useLocalStorage();

    useEffect(() => {
        if (fanpage?.userId) return;
        const fanpageId = getItem('fanpageId');
        apiGetChatGo24('/users/me/pages', rs => {
            if (rs && Array.isArray(rs.data) && rs.data.length > 0) {
                setFanpages(rs.data);
                const fanpage = rs.data.find(r => r.userId === fanpageId);
                if (fanpage) {
                    setFanpage(fanpage);
                }
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const renderContent = () => {
        switch (tabSettings) {
            case 1:
                return <Tags />
            default:
                return <General />
        }
    }
    return (
        <Grid container sx={{ height: '100vh' }}>
            <Grid item xs={2}
                sx={{
                    backgroundColor: theme.bgColor,
                }}
            >
                <Stack>
                    <Stack sx={{ height: 58, backgroundColor: theme.mainColor, borderRight: `1px solid ${theme.borderColor2}` }}><Label name={PageName.Settings.toString()} /></Stack>
                    <Divider />
                    <StackWrapper justifyContent="start" direction="row" alignItems="center" onClick={() => setTabSettings(TabSettings.General)} className={tabSettings === TabSettings.General ? 'active' : ''}>
                        <Avatar src={SettingsIcon} variant="rounded" sx={{ width: 29, height: 24, mr: 2 }} />
                        <Typography variant="body1">
                            <FormattedMessage
                                id="orders.Cài đặt chung"
                                defaultMessage="Cài đặt chung" />
                        </Typography>
                    </StackWrapper>
                    <StackWrapper justifyContent="start" direction="row" alignItems="center" onClick={() => setTabSettings(TabSettings.Tags)} className={tabSettings === TabSettings.Tags ? 'active' : ''}>
                        <Avatar src={TagsIcon} variant="rounded" sx={{ width: 29, height: 24, mr: 2 }} />
                        <Typography variant="body1">
                            <FormattedMessage
                                id="orders.Quản lý nhãn"
                                defaultMessage="Quản lý nhãn" />
                        </Typography>
                    </StackWrapper>
                    <Stack direction="row" alignItems="center" sx={{ p: 1 }}>
                        <Button sx={{ textTransform: 'none', color: theme.mainColor }} onClick={() => navigate(`/message/${fanpage.userId}`)}>
                            <ArrowBackOutlinedIcon sx={{ mr: 1 }} />
                            <Typography variant="body1">
                                <FormattedMessage
                                    id="orders.Quay lại"
                                    defaultMessage="Quay lại" />
                            </Typography>
                        </Button>
                    </Stack>
                </Stack>
            </Grid>
            <Grid item xs={10}>
                <Stack onClick={() => navigate(`/message/${fanpage.userId}`)} direction="row" justifyContent="end" alignItems="center" sx={{
                    cursor: 'pointer',
                    p: 1.2,
                    borderBottom: `1px solid ${theme.borderColor}`,
                    backgroundColor: theme.mainColor,
                }}>
                    <Avatar alt="avatar" src={fanpage.pagePictureUrl} sx={{ width: 38, height: 38, mr: 1 }} />
                    <Text className="text-truncate" sx={{ fontWeight: 400, color: theme.navColor, maxWidth: 150 }} variant="subtitle1" >
                        - {fanpage.pageName}
                    </Text>
                </Stack>
                <Stack sx={{ maxWidth: '60%', margin: '0 auto', p: '20px 0' }}>
                    {renderContent()}
                </Stack>
            </Grid>
        </Grid >
    )
}

export default Settings