import { Avatar, Box, Button, Card, CardContent, Grid, IconButton, Modal, Stack, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useRef, useState } from 'react'
import { useChatStore } from '../../store/chatStore';
import { useSelectConversationStore } from '../../store/selectConversationStore';
import { TabInfo } from '../../utils/enum';
import { useTabStore } from '../../store/changeTabStore';
import { FormattedMessage } from 'react-intl';
import { ChatGo24Repository } from 'repositories/ChatGo24Repository';
import { useLocalStorage } from 'lib/component/Hook/useLocalStorage';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { useConversationsStore } from 'store/conversationsStore';
import { TypographyN } from 'components/Filter';
import { useInfoSelectStore } from 'store/infoSelectStore';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { useAlertStore } from 'store/alertStore';
import StarOutlineOutlinedIcon from '@mui/icons-material/StarOutlineOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import translate from 'translations';
import NoteAddOutlinedIcon from '@mui/icons-material/NoteAddOutlined';
import { IInfo, TempInfo } from 'models/messageModel';
import AddLocationOutlinedIcon from '@mui/icons-material/AddLocationOutlined';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { apiGetChatGo24 } from 'helper/apiHelper';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AddIcon from '@mui/icons-material/Add';
import { TextFieldN } from 'components/re-skin';
import { LuMail, LuMapPin, LuPencil, LuPhoneCall, LuUserCircle2 } from "react-icons/lu";
import { BiStar, BiSolidStar, BiFolderPlus, BiPencil, BiTrash, BiLocationPlus } from "react-icons/bi";
import { Height } from '@mui/icons-material';
const InfoWrapper = styled(Grid)
    (() => {
        const { theme } = useChatStore();
        return {
            display: 'flex',
            flexWrap: 'nowrap',
            backgroundColor: theme.textColor,
            paddingTop: '16px',
            paddingRight: '16px',
            width: '100%',
            marginLeft: 0,
        }
    });
const OrderWrapper = styled(Stack)(() => {
    const { theme } = useChatStore();
    return {
        backgroundColor: theme.bgColor,
        width: '100%',
        borderRadius: '8px',
        padding: '16px'
    }
});

const Text = styled(Typography)(() => {
    const { theme } = useChatStore();
    return {
        color: theme.color,
    }
});
const TextFiledInfo = styled(TextFieldN)(() => {
    return {
        '& input': {
            padding: 0,
            fontSize: '1rem',
        }
    }
});


const Infomation = () => {
    const { theme } = useChatStore();
    const { changeTab } = useTabStore();
    const { conversation, setConversation } = useSelectConversationStore();
    const { getItem } = useLocalStorage();
    const [isEddit, setIsEddit] = useState(false);
    const [isAddInfo, setIsAddInfo] = useState(false);
    const [isEdditInfo, setIsEdditInfo] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const { conversations, changeConversations } = useConversationsStore();
    const { infoSelect, setInfoSelect } = useInfoSelectStore();
    const { setIsOpenAlert, setAlert, setType } = useAlertStore();
    let userId = conversation?.userId ? conversation?.userId : getItem('fanpageId');

    const addressTemp = useRef<IInfo>({
        fullName: translate('orders.Họ và tên', 'Họ và tên'),
        phoneNumber: translate('orders.Số điện thoại', 'Số điện thoại'),
        addressDetail: translate('orders.Địa chỉ chi tiết', 'Địa chỉ chi tiết'),
        isDefault: false,
        isTemp: true,
    });
    const addressBlankTemp = useRef<TempInfo>({
        fullName: translate('orders.Họ và tên', 'Họ và tên'),
        phoneNumber: translate('orders.Số điện thoại', 'Số điện thoại'),
        addressDetail: translate('orders.Địa chỉ chi tiết', 'Địa chỉ chi tiết'),
        province: translate('orders.Tỉnh thành', 'Tỉnh thành'),
        district: translate('orders.Quận huyện', 'Quận huyện'),
        wards: translate('orders.Phường xã', 'Phường xã'),
        buiddingOrStreet: translate('orders.Đường/toà nhà/ngõ', 'Đường/toà nhà/ngõ'),
        isDefault: false,
        isTemp: true,
    });
    const [userAddresses, setUserAddresses] = useState<IInfo[]>([addressTemp.current, addressTemp.current, addressTemp.current]);
    useEffect(() => {
        let _userAddresses = [addressTemp.current, addressTemp.current, addressTemp.current];
        if (conversation?.userAddresses?.length > 0 && conversation?.userAddresses?.length < 3) {
            conversation.userAddresses.map((userAddress, index) => {
                return _userAddresses[index] = userAddress;
            })
            setUserAddresses(_userAddresses);
        } else if (conversation?.userAddresses?.length >= 3) {
            setUserAddresses(conversation?.userAddresses);
        } else {
            setUserAddresses([addressTemp.current, addressTemp.current, addressTemp.current]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conversation?.userAddresses])
    useEffect(() => {
        if (infoSelect && !isEdditInfo && !isAddInfo && !isDelete) {
            handleUpdateInfo();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [infoSelect])

    const handleChange = (e) => {
        let { name, value } = e.target;
        const _conversation = { ...conversation, sentTo: { ...conversation.sentTo, [name]: value } };
        setConversation(_conversation);
    }
    const handleEddit = async () => {
        setIsEddit(false);
        const rs = await ChatGo24Repository.UpdateConversation(userId, conversation.id, { sentTo: { ...conversation.sentTo } });
        if (rs === true) {
            let _conversations = [...conversations];
            _conversations = _conversations.map(con => {
                if (con.id === conversation?.id) {
                    return conversation;
                }
                return con;
            })
            changeConversations(_conversations);
            setAlert('Cập nhật thành công');
            setType('success');
        } else {
            setAlert('Cập nhật thất bại');
            setType('error');
        }
        setIsOpenAlert(true);
    }
    const handleUpdateInfo = async () => {
        const response = await ChatGo24Repository.UpdateAddress(conversation?.id, userId, infoSelect);
        if (response === true) {
            let _conversation = { ...conversation };
            let userAddresses = _conversation.userAddresses?.map(address => {
                if (address.id === infoSelect?.id) {
                    return infoSelect;
                } else if (infoSelect?.isDefault && !isEddit) {
                    return { ...address, isDefault: false };
                };
                return { ...address }
            })
            _conversation = { ..._conversation, userAddresses };
            setConversation(_conversation);
            handleSetConversations(_conversation);
            setAlert('Cập nhật thành công');
            setType('success');
        } else {
            setAlert('Cập nhật thất bại');
            setType('error');
        }
        setInfoSelect(null);
        setIsEdditInfo(false);
        setIsOpenAlert(true);

    }
    const handleSetConversation = (userId: string, conversationId: string) => {
        apiGetChatGo24(`/users/me/pages/${userId}/conversations/${conversationId}`, res1 => {
            if (res1?.data) {
                setConversation(res1?.data);
                handleSetConversations(res1?.data);
            }
        });

    }
    const handleSetConversations = (data) => {
        let updateConversations = [...conversations];
        updateConversations = updateConversations.map(con => {
            if (con.id === data?.id) {
                return data
            } else return con
        })
        changeConversations(updateConversations);
    }
    const handleAddInfo = async () => {
        if (isAddInfo && infoSelect) {
            const response = await ChatGo24Repository.AddAddress(conversation.id, userId, infoSelect);
            if (response === true) {
                handleSetConversation(userId, conversation.id);
                setAlert(translate('info.Thêm địa chỉ thành công', 'Thêm địa chỉ thành công'));
                setType('success');
            } else {
                setAlert(translate('info.Thêm địa chỉ thất bại', 'Thêm địa chỉ thất bại'));
                setType('error');
            }
            setIsOpenAlert(true);
            setIsAddInfo(false);
            setInfoSelect(null);
        }
    }
    const handleDeleteInfo = async () => {
        if (isDelete && infoSelect) {
            const response = await ChatGo24Repository.DeletedAddress(conversation.id, userId, infoSelect);
            if (response === true) {
                const _userAddresses = [...conversation?.userAddresses];
                let index = _userAddresses?.findIndex(ad => ad.id === infoSelect.id);
                if (index > -1) _userAddresses.splice(index, 1);
                let _conversation = { ...conversation, userAddresses: _userAddresses };
                setConversation(_conversation);
                handleSetConversations(_conversation);
                setAlert(translate('info.Xóa địa chỉ thành công', 'Xóa địa chỉ thành công'));
                setType('success');
            } else {
                setAlert(translate('info.Xóa địa chỉ thất bại', 'Xóa địa chỉ thất bại'));
                setType('error');
            }
            setIsOpenAlert(true);
            setIsDelete(false);
            setInfoSelect(null);
        }
    }
    console.log(userAddresses);
    return (
        <Stack p={2}>
            <InfoWrapper container
                columnSpacing={2}
                direction="column"
                sx={{
                    borderRadius: '16px',
                    p: 2
                }}
            >
                <Grid sx={{ display: 'flex' }}>
                    <Grid item mr={1}>
                        <Avatar
                            variant="rounded"
                            sx={{ width: 100, height: 100, borderRadius: '50%', boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.15)'}}
                            src={conversation?.sentTo?.picture}
                        />
                    </Grid>
                    <Grid item alignItems="start" sx={{ width: '100%' }}>
                        {isEddit ? <Box sx={{
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                        }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <TextFieldN fullWidth size="small" variant="standard" className="texfield-info"
                                    value={conversation?.sentTo?.userName ? conversation?.sentTo?.userName : ""} name="userName" InputProps={{
                                        autoComplete: 'new-password',
                                    }} onChange={handleChange} />
                                <Stack direction="row">
                                    <IconButton>
                                        <CheckOutlinedIcon onClick={(handleEddit)} color="success" />
                                    </IconButton>
                                    <IconButton>
                                        <ClearOutlinedIcon onClick={() => setIsEddit(false)} color="error" />
                                    </IconButton>
                                </Stack>
                            </Stack>

                            <Stack direction="row" spacing={1} alignItems="center">
                                <LocalPhoneIcon sx={{ fontSize: '15px' }} />
                                <TextFiledInfo fullWidth size="small" variant="standard" type="number" className="texfield-info"
                                    value={conversation?.sentTo?.phoneNumber ? conversation?.sentTo?.phoneNumber : ""} name="phoneNumber" InputProps={{
                                        autoComplete: 'new-password',
                                    }} onChange={handleChange} />
                            </Stack>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <EmailIcon sx={{ fontSize: '15px' }} />
                                <TextFiledInfo fullWidth size="small" variant="standard" type="text" className="texfield-info"
                                    value={conversation?.sentTo?.userEmail ? conversation?.sentTo?.userEmail : ""} name="userEmail" InputProps={{
                                        autoComplete: 'new-password',
                                    }} onChange={handleChange} />
                            </Stack>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <LocationOnIcon sx={{ fontSize: '15px' }} />
                                <TextFiledInfo fullWidth size="small" variant="standard" type="text" className="texfield-info"
                                    value={conversation?.sentTo?.address ? conversation?.sentTo?.address : ""} name="address" InputProps={{
                                        autoComplete: 'new-password',
                                    }} onChange={handleChange} />
                            </Stack>
                        </Box> : <Box sx={{
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                        }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Text variant="h6" sx={{ whiteSpace: "pre-wrap", color: theme.color3 }}>
                                    {conversation?.sentTo?.userName}
                                </Text>
                                <Tooltip title={translate("info.Chỉnh sửa", "Chỉnh sửa")} placement="right-start">
                                    <IconButton onClick={() => {
                                        setIsEddit(true);
                                    }} sx={{ color: theme.color3 }}>
                                        <LuPencil fontSize={'24px'} />
                                    </IconButton>
                                </Tooltip>
                            </Stack>
                            <Stack direction="row" spacing={1} alignItems="center" borderBottom={`1px solid ${theme.color1}`} pt={2} pb={1}>
                                <Stack sx={{ width: '20px', height: '20px' }}>
                                    <LuPhoneCall fontSize={'20px'} />
                                </Stack>
                                <TextFiledInfo fullWidth size="small" variant="standard" type="number" className="texfield-info"
                                    value={conversation?.sentTo?.phoneNumber ? conversation?.sentTo?.phoneNumber : ""} name="phoneNumber" InputProps={{
                                        autoComplete: 'new-password',
                                        disableUnderline: true
                                    }} />
                            </Stack>
                            <Stack direction="row" spacing={1} alignItems="center" borderBottom={`1px solid ${theme.color1}`} pt={2} pb={1}>
                                <LuMail fontSize={'20px'} />
                                <TextFiledInfo fullWidth size="small" variant="standard" type="text" className="texfield-info"
                                    value={conversation?.sentTo?.userEmail ? conversation?.sentTo?.userEmail : ""} name="userEmail" InputProps={{
                                        autoComplete: 'new-password',
                                        disableUnderline: true
                                    }} />
                            </Stack>
                            <Stack direction="row" spacing={1} alignItems="top" borderBottom={`1px solid ${theme.color1}`} pt={2} pb={1}>
                                <LuMapPin fontSize={'20px'} />
                                <TextFiledInfo fullWidth size="small" variant="standard" type="text" className="texfield-info" multiline maxRows={2}
                                    sx={{height: '3rem'}}
                                    value={conversation?.sentTo?.address ? conversation?.sentTo?.address : ""} name="address" InputProps={{
                                        autoComplete: 'new-password',
                                        disableUnderline: true
                                    }} />
                            </Stack>
                        </Box>}
                        <Stack direction="row" justifyContent="flex-end" sx={{ width: '100%' }}>
                            <Button onClick={() => setIsAddInfo(true)} sx={{ textTransform: 'none', color: theme.color3 }}>
                                {translate("info.Thêm địa chỉ", "Thêm địa chỉ")}
                                <AddIcon />
                            </Button>
                        </Stack>

                    </Grid>
                </Grid>
            </InfoWrapper>
            {/* <Stack direction="row" justifyContent="flex-end" sx={{ backgroundColor: theme.textColor }}>
                
            </Stack> */}
            <Box sx={{
                height: '60vh',
                width: '100%',
                marginTop: 2,
                overflowY: 'scroll',
                '@media (max-width:1700px)': {
                    maxHeight: '62vh',
                },
                '@media (max-width:1300px)': {
                    maxHeight: '57vh',
                },
                '@media (max-width:1100px)': {
                    maxHeight: '52vh',
                }
            }}>
                {userAddresses?.length > 0 &&
                    userAddresses?.map((info, index) =>
                        <OrderWrapper sx={{ mb: 2, width: '100%' }} key={`${info?.id}_${index}`}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                                <TypographyN variant="h6" sx={{ color: theme.color3 }}>
                                    <FormattedMessage
                                        id="info.Địa chỉ"
                                        defaultMessage="Địa chỉ"
                                    /> {index + 1}
                                </TypographyN>
                                {!infoSelect || info?.id !== infoSelect?.id || !isEdditInfo ?
                                    <Stack direction="row">
                                        {!info?.isTemp ? <><Tooltip title={translate("orders.Tạo đơn hàng", "Tạo đơn hàng")} placement="right-start">
                                            <IconButton onClick={() => { setInfoSelect({ ...info }); changeTab(TabInfo.CreateOrder) }} sx={{ color: theme.color3 }}>
                                                <BiFolderPlus />
                                            </IconButton>
                                        </Tooltip>
                                            <Tooltip title={translate("info.Mặc định", "Mặc định")} placement="right-start">
                                                <IconButton onClick={() => setInfoSelect({ ...info, isDefault: !info?.isDefault })}>
                                                    {info?.isDefault ? <BiSolidStar color={theme.color3} /> : <BiStar color={theme.color3} />}
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title={translate("info.Chỉnh sửa", "Chỉnh sửa")} placement="right-start">
                                                <IconButton onClick={() => { setInfoSelect(info); setIsEdditInfo(true) }} sx={{ color: theme.color3 }}>
                                                    <BiPencil />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title={translate("info.Xóa", "Xóa")} placement="right-start">
                                                <IconButton onClick={() => { setInfoSelect(info); setIsDelete(true) }} sx={{ color: '#A30716' }}>
                                                    <BiTrash />
                                                </IconButton>
                                            </Tooltip>
                                        </> : <Tooltip title={translate("info.Thêm địa chỉ", "Thêm địa chỉ")} placement="right-start">
                                            <IconButton sx={{ color: theme.color3 }} onClick={() => setIsAddInfo(true)}>
                                                <BiLocationPlus />
                                            </IconButton>
                                        </Tooltip>}
                                    </Stack> :
                                    <Stack direction="row">
                                        <IconButton>
                                            <CheckOutlinedIcon onClick={handleUpdateInfo} color="success" />
                                        </IconButton>
                                        <IconButton>
                                            <ClearOutlinedIcon onClick={() => { setInfoSelect(null); setIsEdditInfo(false) }} color="error" />
                                        </IconButton>
                                    </Stack>
                                }
                            </Stack>
                            {info?.id === infoSelect?.id && isEdditInfo ? <Stack>
                                <Stack direction="row" spacing={2} pb={1} mb={2} alignItems="center" borderBottom={`1px solid ${theme.color1}`}>
                                    <LuUserCircle2 fontSize={'24px'} />
                                    <TextFiledInfo fullWidth size="small" variant="standard" type="text" className="texfield-info" sx={{ color: theme.color3 }}
                                        value={infoSelect?.fullName} name={`fullName_${infoSelect?.id}`} InputProps={{
                                            autoComplete: 'new-password',
                                        }}
                                        onChange={(e) => setInfoSelect({ ...infoSelect, fullName: e.target.value })} />
                                </Stack>
                                <Stack direction="row" spacing={2} pb={1} mb={2} alignItems="center" borderBottom={`1px solid ${theme.color1}`}>
                                    <LuPhoneCall fontSize={'24px'} />
                                    <TextFiledInfo fullWidth size="small" variant="standard" type="number" className="texfield-info" sx={{ color: theme.color3 }}
                                        value={infoSelect?.phoneNumber} name={`phoneNumber_${infoSelect?.id}`} InputProps={{
                                            autoComplete: 'new-password',
                                        }}
                                        onChange={(e) => setInfoSelect({ ...infoSelect, phoneNumber: e.target.value })} />
                                </Stack>
                                <Stack direction="row" spacing={2} pb={1} alignItems="top" borderBottom={`1px solid ${theme.color1}`}>
                                    <LuMapPin fontSize={'24px'} />
                                    <TextFiledInfo fullWidth size="small" variant="standard" type="text" className="texfield-info" sx={{ color: theme.color3 }} multiline maxRows={4}
                                        value={infoSelect?.addressDetail} name={`addressDetail_${infoSelect?.id}`} InputProps={{
                                            autoComplete: 'new-password',
                                        }}
                                        onChange={(e) => setInfoSelect({ ...infoSelect, addressDetail: e.target.value })} />
                                </Stack>
                            </Stack> :
                                (<> {!info?.isTemp ?
                                    <Stack>
                                        <Stack direction="row" spacing={2} pb={1} mb={2} alignItems="center" borderBottom={`1px solid ${theme.color1}`}>
                                            <LuUserCircle2 fontSize={'24px'} />
                                            <TextFiledInfo fullWidth size="small" variant="standard" type="text" className="texfield-info" sx={{ color: theme.color3 }}
                                                value={info?.fullName} name={`fullName_${index}`} InputProps={{
                                                    autoComplete: 'new-password',
                                                    disableUnderline: true
                                                }} />
                                        </Stack>
                                        <Stack direction="row" spacing={2} pb={1} mb={2} alignItems="center" borderBottom={`1px solid ${theme.color1}`}>
                                            <LuPhoneCall fontSize={'24px'} />
                                            <TextFiledInfo fullWidth size="small" variant="standard" type="text" className="texfield-info" sx={{ color: theme.color3 }}
                                                value={info?.phoneNumber} name={`phoneNumber_${index}`} InputProps={{
                                                    autoComplete: 'new-password',
                                                    disableUnderline: true
                                                }} />
                                        </Stack>
                                        <Stack direction="row" spacing={2} pb={1} alignItems="top" borderBottom={`1px solid ${theme.color1}`}>
                                            <LuMapPin fontSize={'24px'} />
                                            <TextFiledInfo fullWidth size="small" variant="standard" type="text" className="texfield-info" sx={{ color: theme.color3 }} multiline maxRows={4}
                                                value={info?.addressDetail} name={`addressDetail_${index}`} InputProps={{
                                                    autoComplete: 'new-password',
                                                    disableUnderline: true
                                                }} />
                                        </Stack>
                                    </Stack> :
                                    <Stack>
                                        <Stack direction="row" spacing={2} pb={1} mb={2} alignItems="center" borderBottom={`1px solid ${theme.color1}`}>
                                            <LuUserCircle2 fontSize={'24px'} />
                                            <TextFiledInfo fullWidth size="small" variant="standard" type="text" className="texfield-info" sx={{ color: theme.color3 }}
                                                value={addressBlankTemp.current.fullName} name={`fullName_${index}`} InputProps={{
                                                    autoComplete: 'new-password',
                                                    disableUnderline: true
                                                }} />
                                        </Stack>
                                        <Stack direction="row" spacing={2} pb={1} mb={2} alignItems="center" borderBottom={`1px solid ${theme.color1}`}>
                                            <LuPhoneCall fontSize={'24px'} />
                                            <TextFiledInfo fullWidth size="small" variant="standard" type="text" className="texfield-info" sx={{ color: theme.color3 }}
                                                value={addressBlankTemp.current.phoneNumber} name={`phoneNumber_${index}`} InputProps={{
                                                    autoComplete: 'new-password',
                                                    disableUnderline: true
                                                }} />
                                        </Stack>
                                        <Stack direction="row" spacing={2} pb={1} mb={2} alignItems="top" borderBottom={`1px solid ${theme.color1}`}>
                                            <LuMapPin fontSize={'24px'} />
                                            <TextFiledInfo fullWidth size="small" variant="standard" type="text" className="texfield-info" sx={{ color: theme.color3 }} multiline maxRows={4}
                                                value={addressBlankTemp.current.addressDetail} name={`addressDetail_${index}`} InputProps={{
                                                    autoComplete: 'new-password',
                                                    disableUnderline: true
                                                }} />
                                        </Stack>
                                        <Stack direction="row" spacing={2} pb={1} mb={2} alignItems="top" borderBottom={`1px solid ${theme.color1}`}>
                                            <LuMapPin fontSize={'24px'} />
                                            <TextFiledInfo fullWidth size="small" variant="standard" type="text" className="texfield-info" sx={{ color: theme.color3 }} multiline maxRows={4}
                                                value={addressBlankTemp.current.province} name={`addressDetail_${index}`} InputProps={{
                                                    autoComplete: 'new-password',
                                                    disableUnderline: true
                                                }} />
                                        </Stack>
                                        <Stack direction="row" spacing={2} pb={1} mb={2} alignItems="top" borderBottom={`1px solid ${theme.color1}`}>
                                            <LuMapPin fontSize={'24px'} />
                                            <TextFiledInfo fullWidth size="small" variant="standard" type="text" className="texfield-info" sx={{ color: theme.color3 }} multiline maxRows={4}
                                                value={addressBlankTemp.current.district} name={`addressDetail_${index}`} InputProps={{
                                                    autoComplete: 'new-password',
                                                    disableUnderline: true
                                                }} />
                                        </Stack>
                                        <Stack direction="row" spacing={2} pb={1} mb={2} alignItems="top" borderBottom={`1px solid ${theme.color1}`}>
                                            <LuMapPin fontSize={'24px'} />
                                            <TextFiledInfo fullWidth size="small" variant="standard" type="text" className="texfield-info" sx={{ color: theme.color3 }} multiline maxRows={4}
                                                value={addressBlankTemp.current.wards} name={`addressDetail_${index}`} InputProps={{
                                                    autoComplete: 'new-password',
                                                    disableUnderline: true
                                                }} />
                                        </Stack>
                                        <Stack direction="row" spacing={2} pb={1} alignItems="top" borderBottom={`1px solid ${theme.color1}`}>
                                            <LuMapPin fontSize={'24px'} />
                                            <TextFiledInfo fullWidth size="small" variant="standard" type="text" className="texfield-info" sx={{ color: theme.color3 }} multiline maxRows={4}
                                                value={addressBlankTemp.current.buiddingOrStreet} name={`addressDetail_${index}`} InputProps={{
                                                    autoComplete: 'new-password',
                                                    disableUnderline: true
                                                }} />
                                        </Stack>
                                    </Stack>
                                }
                                </>)}

                        </OrderWrapper>)}
            </Box>
            <Modal
                open={isAddInfo}
                onClose={() => setIsAddInfo(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box id="modal-modal-description" sx={{
                    position: "absolute",
                    left: '50%',
                    top: '50%',
                    width: '30%',
                    transform: 'translate(-50%, -50%)'
                }}>
                    <Card id="orders-modal-description" sx={{
                        color: theme.color,
                        backgroundColor: theme.bgColor,
                    }}>
                        <CardContent
                        >
                            <Typography variant="h6" component="h2"><FormattedMessage
                                id="info.Thêm địa chỉ"
                                defaultMessage="Thêm địa chỉ"
                            /></Typography>

                            <Stack sx={{ my: 2 }}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <AccountCircleOutlinedIcon sx={{ fontSize: '15px' }} />
                                    <TextFiledInfo fullWidth size="small" variant="standard" type="text" className="texfield-info" sx={{ fontSize: '16px' }}
                                        value={infoSelect?.fullName} name={`fullName_${infoSelect?.id}`} InputProps={{
                                            autoComplete: 'new-password',
                                        }}
                                        onChange={(e) => setInfoSelect({ ...infoSelect, fullName: e.target.value })}
                                        label={translate('orders.Họ và tên', 'Họ và tên')} />
                                </Stack>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <LocalPhoneIcon sx={{ fontSize: '15px' }} />
                                    <TextFiledInfo fullWidth size="small" variant="standard" type="number" className="texfield-info" sx={{ fontSize: '16px' }}
                                        value={infoSelect?.phoneNumber} name={`phoneNumber_${infoSelect?.id}`} InputProps={{
                                            autoComplete: 'new-password',
                                        }}
                                        onChange={(e) => setInfoSelect({ ...infoSelect, phoneNumber: e.target.value })}
                                        label={translate('orders.Số điện thoại', 'Số điện thoại')} />
                                </Stack>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <LocationOnIcon sx={{ fontSize: '15px' }} />
                                    <TextFiledInfo fullWidth size="small" variant="standard" type="text" className="texfield-info" sx={{ fontSize: '16px' }}
                                        value={infoSelect?.addressDetail} name={`addressDetail_${infoSelect?.id}`} InputProps={{
                                            autoComplete: 'new-password',
                                        }}
                                        onChange={(e) => setInfoSelect({ ...infoSelect, addressDetail: e.target.value })}
                                        label={translate('orders.Địa chỉ chi tiết', 'Địa chỉ chi tiết')} />
                                </Stack>
                            </Stack>

                            <Stack direction="row" justifyContent="right">
                                <Button onClick={() => setIsAddInfo(false)} color="error"><FormattedMessage
                                    id="infoOrder.Hủy"
                                    defaultMessage="Hủy"
                                /></Button>
                                <Button onClick={handleAddInfo} color="primary"><FormattedMessage
                                    id="info.Thêm địa chỉ"
                                    defaultMessage="Thêm địa chỉ"
                                /></Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Box>
            </Modal>
            <Modal
                open={isDelete}
                onClose={() => setIsDelete(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box id="modal-modal-description" sx={{
                    position: "absolute",
                    left: '50%',
                    top: '50%',
                    width: '30%',
                    transform: 'translate(-50%, -50%)'
                }}>
                    <Card id="orders-modal-description" sx={{
                        color: theme.color,
                        backgroundColor: theme.bgColor,
                    }}>
                        <CardContent
                        >
                            <Typography variant="h6" component="h2"><FormattedMessage
                                id="infoOrder.Xác nhận"
                                defaultMessage="Xác nhận"
                            /></Typography>
                            <Typography component="span"><FormattedMessage
                                id="infoOrder.Bạn có chắc chắn muốn xóa địa chỉ này?"
                                defaultMessage="Bạn có chắc chắn muốn xóa địa chỉ này?"
                            /></Typography>
                            <Stack direction="row" justifyContent="right">
                                <Button onClick={() => setIsDelete(false)} color="error"><FormattedMessage
                                    id="infoOrder.Hủy"
                                    defaultMessage="Hủy"
                                /></Button>
                                <Button onClick={handleDeleteInfo} color="primary"><FormattedMessage
                                    id="infoOrder.Xác nhận"
                                    defaultMessage="Xác nhận"
                                /></Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Box>
            </Modal>
        </Stack>

    )
}

export default Infomation