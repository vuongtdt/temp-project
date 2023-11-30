import {
    Avatar,
    Box,
    List,
    ListItemAvatar,
    Stack,
    styled,
    Typography,
    IconButton,
    Dialog,
    DialogActions ,
    DialogContent,
    DialogContentText,
    Button,
    Badge,
  } from "@mui/material";
import React, { useEffect, useRef, useState } from 'react';
import { useChatStore } from 'store/chatStore';
import { useNavigate } from 'react-router-dom';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import { useLocalStorage } from 'lib/component/Hook/useLocalStorage';
import { apiDeleteChatGo24 } from 'helper/apiHelper';
import { FormattedMessage } from 'react-intl';
import { FanpageModel } from 'models/fanpageModels';
import { useConnectionStore } from 'store/connectionStore';
import { HubConnectionBuilder } from '@microsoft/signalr';
import config from '../../config';
import { useAlertStore } from 'store/alertStore';
import { LOGIN_URL } from 'models/constants';
import { BoxBG, ConnectedListItem, LoadingButtonN, Text } from 'components/re-skin';
import { stringAvatar } from 'helper/helper';
import translate from "../../translations";
import facebookLogo from "Assets/Images/facebook-logo.png";

type Props = {
    data: FanpageModel[],
    changeData: Function,
    removePage: Function,
    isBtnLoading: boolean
    onLogout: Function,
}

const TextDetail = styled(Typography)(() => {
    const { theme } = useChatStore();
    return {
        color: theme.color,
        '@media (max-width:1700px)': {
            fontSize: '12px'
        },
    }
});

const ConnectedList = (props: Props) => {
    const { theme } = useChatStore();
    const navigate = useNavigate();
    const { setItem, getItem } = useLocalStorage();
    const { setConnection } = useConnectionStore();
    const connectionRef = useRef<any>();
    const { setIsOpenAlert, setAlert, setType } = useAlertStore();
    const [processing, setProccessing] = useState<any>({
        data: '',
        userId: ''
    });
    const [isOpenConfirmDialog, setIsOpenConfirmDialog] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string>();

    useEffect(() => {
        connectionRef.current = new HubConnectionBuilder().withUrl(`${config.baseUrl}/hubs/facebook?accessToken=${getItem('accessToken')}`).withAutomaticReconnect().build();
        connectionRef.current.onreconnecting(() => {          
            setType('warning');
            setAlert(translate(
                "fanpages.Bạn đã bị mất kết nối, đang kết nối lại...",
                "Bạn đã bị mất kết nối, đang kết nối lại..."
            ));
            setIsOpenAlert(true);
        });
        connectionRef.current.onreconnected(() => {
            setType('success');
            setAlert(translate(
                "fanpages.Đã kết nối lại",
                "Đã kết nối lại"
            ));
            setIsOpenAlert(true);
        });
        setConnection(connectionRef.current);
        return (() => {
            connectionRef.current.stop();
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if (connectionRef.current) {
            connectionRef.current.start()
                .then(result => {
                    connectionRef.current.on('OnSyncMessagesProcess', (userId, conversationId, current, totalConversation) => {
                        let _processing = (parseFloat(current) * 100 / parseFloat(totalConversation)).toFixed(2);
                        setProccessing({
                            ...processing,
                            data: _processing,
                            userId
                        });
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
    const handleClick = (userId: string) => {
        setItem('fanpageId', userId)
        navigate(`/message/${userId}`, { replace: true });
    }
    const handleRefreshClick = (userId: string, baseUserId: string) => {
        window.location.href = `${config.baseUrl}/auth/login-facebook/web?state=refreshtoken-${userId}-${baseUserId}`;
    }
    const handleDisconnect = () => {
        apiDeleteChatGo24(`/users/me/pages/${selectedUserId}`, rs => {
            if (rs?.data) {
                props.removePage();
            }
        })
    }
    const onDisconnect = (userId: string) => {
        setSelectedUserId(userId);
        setIsOpenConfirmDialog(true);
    }
    const handleChangeData = () => {
        props.changeData();
    }

    const SmallAvatar = styled(Avatar)(({ theme }) => ({
        width: 22,
        height: 22,
        border: `2px solid ${theme.palette.background.paper}`,
      }));

    return (
        <List>
            <Text sx={{ fontWeight: 500, color: theme.textColor, mb: 4, textAlign: "center" }} variant="h4" gutterBottom><FormattedMessage
                id="fanpages.Danh sách đã kết nối"
                defaultMessage="Danh sách đã kết nối"
            /></Text>
            <BoxBG>
                {props.data?.map((d, index) => 
                    <ConnectedListItem key={index}>
                        <ListItemAvatar>
                            <Badge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                badgeContent={
                                    <SmallAvatar src={facebookLogo}/>
                                }>
                                <Avatar src={d.pagePictureUrl} sx={{
                                    height: 38, mr: 1
                                    }} >
                                    <Avatar {...stringAvatar(d?.pageName)}/>
                                </Avatar>
                            </Badge>
                        </ListItemAvatar>
                        <Box sx={{ width: '100%' }}>
                            <Stack direction="row" alignItems="center" spacing={0.3}>
                                <Text sx={{ fontWeight: 500, color: theme.navColor }} variant="body1" gutterBottom>
                                    {d.pageName}
                                </Text>
                                {/* {!d.isExpired && <CheckCircleOutlinedIcon color="success" sx={{ width: 20, height: 20 }} />}
                                {d.isExpired && <ErrorOutlineOutlinedIcon color="error" sx={{ width: 20, height: 20 }} />} */}
                            </Stack>
                            <Stack direction="row" justifyContent="space-between"  >
                                <Stack direction="row" spacing={3} justifyContent="space-between" alignItems="center" >
                                    {/* <TextDetail variant="body2">
                                        <FormattedMessage
                                            id="fanpages.Ngày kết nối: "
                                            defaultMessage="Ngày kết nối: "
                                        />{formatDate(d.createdOn, 'HH:mm DD-MM-YY')}
                                    </TextDetail> */}
                                    {processing?.data !== '100.00' && processing?.userId === d.userId && <TextDetail sx={{ color: 'red' }} variant="body2" >
                                        <FormattedMessage
                                            id="fanpages.Đang đồng bộ tin nhắn..."
                                            defaultMessage="Đang đồng bộ tin nhắn..."
                                        />{`${processing.data}%`}
                                    </TextDetail>}
                                </Stack>
                            </Stack>
                        </Box>
                        <Box sx={{ whiteSpace: 'nowrap' }}>
                            {!d.isExpired &&
                                <LoadingButtonN onClick={() => handleClick(d.userId)}>
                                    <FormattedMessage
                                        id="fanpages.Truy cập"
                                        defaultMessage="Truy cập"
                                    /></LoadingButtonN>
                            }
                            {d.isExpired &&
                                <LoadingButtonN onClick={() => handleRefreshClick(d.userId, d.baseUserId)}>
                                    <FormattedMessage
                                        id="fanpages.Làm mới quyền truy cập"
                                        defaultMessage="Làm mới quyền truy cập"
                                    /></LoadingButtonN>
                            }
                            <IconButton onClick={() => onDisconnect(d.userId)}>
                                <LinkOffIcon color="error" />
                            </IconButton>
                        </Box>
                    </ConnectedListItem>)
                }
            </BoxBG>
            <Box sx={{ display: 'flex', justifyContent: "space-between" }} >
                <LoadingButtonN
                    onClick={() => props.onLogout()}
                    loading={props.isBtnLoading}
                    variant="outlined"
                    sx={{ mt: 2 }}
                    style={{borderColor: '#eb6464'}}
                    >
                    <FormattedMessage
                        id="fanpages.Đăng xuất"
                        defaultMessage="Đăng xuất" />
                </LoadingButtonN>
                <LoadingButtonN
                    onClick={() => handleChangeData()}
                    loading={props.isBtnLoading}
                    variant="outlined"
                    sx={{ mt: 2 }}>
                    <FormattedMessage
                        id="fanpages.+ Thêm kết nối"
                        defaultMessage="+ Thêm kết nối" />
                </LoadingButtonN>
            </Box>
            <Dialog
                open={isOpenConfirmDialog}
                aria-labelledby="remove-fanpage-alert-dialog-title"
                aria-describedby="remove-fanpage-alert-dialog-description"
            >
                <DialogContent>
                    <DialogContentText id="remove-fanpage-alert-dialog-description">
                        {translate('fanpages.Bạn có chắc chắn muốn xóa fanpage khỏi tài khoản?', 'Bạn có chắc chắn muốn xóa fanpage khỏi tài khoản?')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsOpenConfirmDialog(false)}>{translate('fanpages.Không', 'Không')}</Button>
                    <Button onClick={handleDisconnect} autoFocus>
                        {translate('fanpages.Có', 'Có')}
                    </Button>
                </DialogActions>
            </Dialog>
        </List>
    )
}

export default ConnectedList