import {
    Avatar,
    Box,
    Link,
    List,
    ListItemAvatar,
    Stack,
    styled,
    Typography,
  } from "@mui/material";
import React from 'react';
import { useChatStore } from 'store/chatStore';
import { FormattedMessage } from 'react-intl';
import { BoxBG, LoadingButtonN, PlatformListItem, Text } from 'components/re-skin';
import facebookLogo from "Assets/Images/facebook-platform-logo.png";
import instagramLogo from "Assets/Images/instagram-logo.png";
import zaloLogo from "Assets/Images/zalo-logo.png";
import whatsappLogo from "Assets/Images/whatsapp-logo.png";
import translate from "translations";

type Props = {
    addConnection: Function,
    isBtnLoading: boolean
    onLogout: Function,
    onBack: Function,
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

const PlatformList = (props: Props) => {
    const { theme } = useChatStore();

    const handleAddConnection = (userId: string) => {
        props.addConnection();
    }

    const handleBackToConnectedList = () => {
        props.onBack();
    }

    return (
        <List>
            <Text sx={{ fontWeight: 500, color: theme.textColor, mb: 1, textAlign: "center" }} variant="h4" gutterBottom><FormattedMessage
                id="fanpages.Kênh kết nối"
                defaultMessage="Kênh kết nối"
            /></Text>
            <BoxBG sx={{ maxHeight: '60vh'}}>
                <PlatformListItem sx={{ paddingTop: '10px', paddingBottom: '10px' }}>
                    <ListItemAvatar>
                        <Avatar variant="square" alt="Logo" src={facebookLogo} sx={{ borderRadius: '5px', width: 50, height: 50 }}>
                        </Avatar> 
                    </ListItemAvatar>
                    <Box sx={{ width: '100%', marginLeft: '20px', marginRight: '10px' }}>
                        <Stack direction="row" alignItems="center" spacing={0.3}>
                            <Text sx={{ fontWeight: 500, color: theme.mainColor  }} variant="h6" gutterBottom>
                                <FormattedMessage
                                    id="fanpages.Facebook"
                                    defaultMessage="Facebook"
                                />
                            </Text>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between"  >
                            <Stack direction="row" spacing={3} justifyContent="space-between" alignItems="center" >
                                <TextDetail sx={{ color: theme.hoverTextColor  }} variant="body2">
                                    <FormattedMessage
                                        id="fanpages.Bán và tạo đơn hàng trực tiếp trên Meta Business Suite, quản lý tất cả các comment, inbox, thông tin khách hàng và tạo vận chuyển đơn hàng."
                                        defaultMessage="Bán và tạo đơn hàng trực tiếp trên Meta Business Suite, quản lý tất cả các comment, inbox, thông tin khách hàng và tạo vận chuyển đơn hàng."
                                    />
                                </TextDetail>
                            </Stack>
                        </Stack>
                    </Box>
                    <Box sx={{ whiteSpace: 'nowrap' }}>
                        <LoadingButtonN 
                            onClick={() => handleAddConnection('Facebook')}
                            >
                            <FormattedMessage
                                id="fanpages.+ Thêm kết nối"
                                defaultMessage="+ Thêm kết nối"
                            /></LoadingButtonN>
                    </Box>
                </PlatformListItem>
                <PlatformListItem sx={{ paddingTop: '10px', paddingBottom: '10px' }}>
                    <ListItemAvatar>
                        <Avatar variant="square" alt="Logo" src={instagramLogo} sx={{ borderRadius: '5px', width: 50, height: 50 }}>
                        </Avatar> 
                    </ListItemAvatar>
                    <Box sx={{ width: '100%', marginLeft: '20px', marginRight: '10px' }}>
                        <Stack direction="row" alignItems="center" spacing={0.3}>
                            <Text sx={{ fontWeight: 500, color: theme.mainColor  }} variant="h6" gutterBottom>
                                <FormattedMessage
                                    id="fanpages.Instagram"
                                    defaultMessage="Instagram"
                                />
                            </Text>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between"  >
                            <Stack direction="row" spacing={3} justifyContent="space-between" alignItems="center" >
                                <TextDetail sx={{ color: theme.hoverTextColor  }} variant="body2">
                                    <FormattedMessage
                                        id="fanpages.Bán và tạo đơn hàng trực tiếp trên Instagram, quản lý tất cả các comment, inbox, thông tin khách hàng và tạo vận chuyển đơn hàng."
                                        defaultMessage="Bán và tạo đơn hàng trực tiếp trên Instagram, quản lý tất cả các comment, inbox, thông tin khách hàng và tạo vận chuyển đơn hàng."
                                    />
                                </TextDetail>
                            </Stack>
                        </Stack>
                    </Box>
                    <Box sx={{ whiteSpace: 'nowrap' }}>
                        <LoadingButtonN 
                            disabled={true}
                            onClick={() => handleAddConnection('Instagram')}
                            >
                            <FormattedMessage
                                id="fanpages.+ Thêm kết nối"
                                defaultMessage="+ Thêm kết nối"
                            /></LoadingButtonN>
                    </Box>
                </PlatformListItem>
                <PlatformListItem sx={{ paddingTop: '10px', paddingBottom: '10px' }}>
                    <ListItemAvatar>
                        <Avatar variant="square" alt="Logo" src={zaloLogo} sx={{ borderRadius: '5px', width: 50, height: 50 }}>
                        </Avatar> 
                    </ListItemAvatar>
                    <Box sx={{ width: '100%', marginLeft: '20px', marginRight: '10px' }}>
                        <Stack direction="row" alignItems="center" spacing={0.3}>
                            <Text sx={{ fontWeight: 500, color: theme.mainColor  }} variant="h6" gutterBottom>
                                <FormattedMessage
                                    id="fanpages.Zalo"
                                    defaultMessage="Zalo"
                                />
                            </Text>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between"  >
                            <Stack direction="row" spacing={3} justifyContent="space-between" alignItems="center" >
                                <TextDetail sx={{ color: theme.hoverTextColor  }} variant="body2">
                                    <FormattedMessage
                                        id="fanpages.Quản lý inbox, thông tin khách hàng, đơn hàng và tạo vận chuyển từ Zalo, giúp khách mua hàng trực tiếp khi vào Zalo store."
                                        defaultMessage="Quản lý inbox, thông tin khách hàng, đơn hàng và tạo vận chuyển từ Zalo, giúp khách mua hàng trực tiếp khi vào Zalo store."
                                    />
                                </TextDetail>
                            </Stack>
                        </Stack>
                    </Box>
                    <Box sx={{ whiteSpace: 'nowrap' }}>
                        <LoadingButtonN 
                            disabled={true}
                            onClick={() => handleAddConnection('Zalo')}
                            >
                            <FormattedMessage
                                id="fanpages.+ Thêm kết nối"
                                defaultMessage="+ Thêm kết nối"
                            /></LoadingButtonN>
                    </Box>
                </PlatformListItem>
                <PlatformListItem sx={{ paddingTop: '10px', paddingBottom: '10px' }}>
                    <ListItemAvatar>
                        <Avatar variant="square" alt="Logo" src={whatsappLogo} sx={{ borderRadius: '5px', width: 50, height: 50 }}>
                        </Avatar> 
                    </ListItemAvatar>
                    <Box sx={{ width: '100%', marginLeft: '20px', marginRight: '10px' }}>
                        <Stack direction="row" alignItems="center" spacing={0.3}>
                            <Text sx={{ fontWeight: 500, color: theme.mainColor  }} variant="h6" gutterBottom>
                                <FormattedMessage
                                    id="fanpages.WhatsApp"
                                    defaultMessage="WhatsApp"
                                />
                            </Text>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between"  >
                            <Stack direction="row" spacing={3} justifyContent="space-between" alignItems="center" >
                                <TextDetail sx={{ color: theme.hoverTextColor  }} variant="body2">
                                    <FormattedMessage
                                        id="fanpages.Quản lý inbox, thông tin khách hàng, đơn hàng và tạo vận chuyển trực tiếp trong quá trình nhắn tin trên WhatApps."
                                        defaultMessage="Quản lý inbox, thông tin khách hàng, đơn hàng và tạo vận chuyển trực tiếp trong quá trình nhắn tin trên WhatApps."
                                    />
                                </TextDetail>
                            </Stack>
                        </Stack>
                    </Box>
                    <Box sx={{ whiteSpace: 'nowrap' }}>
                        <LoadingButtonN 
                            disabled={true}
                            onClick={() => handleAddConnection('WhatsApp')}
                            >
                            <FormattedMessage
                                id="fanpages.+ Thêm kết nối"
                                defaultMessage="+ Thêm kết nối"
                            /></LoadingButtonN>
                    </Box>
                </PlatformListItem>
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
                    onClick={() => handleBackToConnectedList()}
                    loading={props.isBtnLoading}
                    variant="outlined"
                    sx={{ mt: 2 }}>
                    <FormattedMessage
                        id="fanpages.Danh sách đã kết nối"
                        defaultMessage="Danh sách đã kết nối" />
                </LoadingButtonN>
            </Box>
            <Typography sx={{ fontWeight: 500, color: theme.textColor, textAlign: "center", marginTop: "10px", marginBottom: "10px" }}>
                  {translate(
                    "fanpages.Nhấn vào nút 'THÊM KẾT NỐI' đồng nghĩa với việc bạn đồng ý với các",
                    "Nhấn vào nút 'THÊM KẾT NỐI' đồng nghĩa với việc bạn đồng ý với các "
                  )}
                  <Link color={theme.hoverTextColor} href={`https://go24.vn/quy-dinh-va-dieu-khoan-html/`} target="_blank">
                    {translate("fanpages.điều khoản dịch vụ và chính sách bảo mật", "điều khoản dịch vụ và chính sách bảo mật")}
                  </Link>
                  {translate(
                    "fanpages.của GO24.",
                    " của GO24."
                  )}
            </Typography>
        </List>
    )
}

export default PlatformList