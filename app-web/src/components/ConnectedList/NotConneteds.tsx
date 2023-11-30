import { Avatar, Box, List, ListItemAvatar, Stack, styled, Typography } from '@mui/material';
import React, { useState } from 'react'
import { useChatStore } from '../../store/chatStore';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../../lib/component/Hook/useLocalStorage';
import { apiPostChatGo24 } from '../../helper/apiHelper';
import { FormattedMessage } from 'react-intl';
import { BoxBG, ButtonRS, ConnectedListItem, LoadingButtonN } from 'components/re-skin';
interface Props {
    data: DataModel[],
    changeData: Function;
}
interface DataModel {
    id: string,
    pageName: string,
    pictureUrl: string,
    hasPermission: true,
    isAdded: true
}

const Text = styled(Typography)(() => {
    const { theme } = useChatStore();
    return {
        color: theme.color,
        marginBottom: 0,
    }
});

const NotConneteds = (props: Props) => {
    const { getItem } = useLocalStorage();
    const { theme } = useChatStore();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleRedirect = () => {
        navigate('/', { replace: false });
        props.changeData()
    }
    const handleClick = (userId: string) => {
        const ownerId = getItem('userId');
        setIsLoading(true);
        if (userId && ownerId)
            apiPostChatGo24('/users/me/pages', {
                ownerId,
                userId,
            }, (rs => {
                if (rs?.data) {
                    handleRedirect();
                }
                setIsLoading(false);
            }))
    }

    return (
        <List>
            <Text sx={{ fontWeight: 500, color: theme.textColor, mb: 4, textAlign: "center" }} variant="h4" gutterBottom><FormattedMessage
                id="fanpages.Danh sách chưa kết nối"
                defaultMessage="Danh sách chưa kết nối"
            /></Text>
            <BoxBG>
                {props.data?.map((d: any) => <ConnectedListItem key={d.id}>
                    <ListItemAvatar>
                        <Avatar src={d.pictureUrl}>
                        </Avatar>
                    </ListItemAvatar>
                    <Box sx={{ width: '100%' }}>
                        {!d.hasPermission ?
                            <>
                                <Stack direction="row" alignItems="center" spacing={0.3}>
                                    <Text sx={{ fontWeight: 500, color: theme.noteColor }} variant="body1" gutterBottom>
                                        {d.pageName} - 
                                    </Text>
                                    <RemoveCircleOutlineOutlinedIcon sx={{width:20,height:20}} color="error" />
                                </Stack>
                                <Text variant="body2" ><FormattedMessage
                                    id="fanpages.Bạn không đủ quyền quản lý trang Facebook này nên không thể thực hiện kết nối trang."
                                    defaultMessage="Bạn không đủ quyền quản lý trang Facebook này nên không thể thực hiện kết nối trang."
                                />
                                </Text>

                            </>
                            : <>
                                <Stack direction="row" alignItems="center" spacing={0.3}>
                                    <Text sx={{ fontWeight: 500, color: theme.noteColor }} variant="body1" gutterBottom>
                                        {d.pageName} - 
                                    </Text>
                                    <CheckCircleOutlinedIcon sx={{width:20,height:20}} color="success" />
                                </Stack>
                                <Text variant="body2" ><FormattedMessage
                                    id="fanpages.Đã đăng nhập"
                                    defaultMessage="Đã đăng nhập"
                                />
                                </Text>
                            </>

                        }
                    </Box>
                    <Box sx={{ whiteSpace: 'nowrap' }}>
                        <LoadingButtonN
                            onClick={() => handleClick(d.id)}
                            loading={isLoading}
                            variant="outlined"
                            disabled={!d.hasPermission}
                        ><FormattedMessage
                                id="fanpages.Kết nối"
                                defaultMessage="Kết nối"
                            />
                        </LoadingButtonN>
                    </Box>

                </ConnectedListItem>)
                }
            </BoxBG>
            <ButtonRS sx={{ marginTop: '20px', }} variant="contained" onClick={() => handleRedirect()}><FormattedMessage
                id="fanpages.Trở lại"
                defaultMessage="Trở lại"
            />
            </ButtonRS>
        </List>
    )
}

export default NotConneteds