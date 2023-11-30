import { OrderModel, ShowActionModel } from 'models/orderModel';
import React, { useEffect, useRef, useState } from 'react'
import { Go24Repository } from 'repositories/Go24Repository';
import { useSelectConversationStore } from '../../store/selectConversationStore';
import { Button as ButtonM, Avatar, Box, Stack, styled, Typography, Modal, Card, CardContent, List, ListItem, ListItemIcon, Divider, IconButton, Menu, MenuItem, Fade, TextField } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import { useChatStore } from '../../store/chatStore';
import config from 'config';
import PhotoIcon from '@mui/icons-material/Photo';
import { formatDate, formatNumber } from 'helper/helper';
import Loader from 'lib/component/Loader';
import InfiniteScroll from 'react-infinite-scroll-component';
import createCart from '../../Assets/Images/createCart3.png';
import Button from '../../lib/component/Button';
import { CODStatuses, CODStatusesText, DeliveryStatus, DeliveryStatusText, OrderPaidStatuses, OrderPaidStatusesText, OrderStatus, OrderStatusText, RequireOrder, TabInfo } from 'utils/enum';
import { useTabStore } from '../../store/changeTabStore';
import GHN from '../../Assets/Images/GHN.png';
import BestExpress from '../../Assets/Images/BestExpress.png';
import GHTK from '../../Assets/Images/GHTK.png';
import Ninjavan from '../../Assets/Images/Ninjavan.png';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import translate from 'translations';
import { types, typeShowItem } from './dataType';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import InfoIcon from '@mui/icons-material/Info';
import { useAlertStore } from 'store/alertStore';
import { useSelectOrder } from 'store/selectOrder';
import { apiPostGo24 } from 'helper/apiHelper';
import LinearProgress from '@mui/material/LinearProgress';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
const OrderWrapper = styled(Stack)(() => {
    const { theme } = useChatStore();
    return {
        background: `url(${createCart}) no-repeat center bottom / contain`,
        backgroundColor: theme.bgColor,
        height: '100%',
        width: '100%',
        borderRadius: '10px',
        padding: '20px'
    }
});
const Text = styled(Typography)(() => {
    return {
        color: 'gray',
        textTransform: 'capitalize'
    }
});

const Orders = () => {
    const [mesRequire, setMesRequire] = useState<any>({
        status: '',
        statusText: '',
        content: '',
    });
    const { theme } = useChatStore();
    const { conversation } = useSelectConversationStore();
    const [orders, setOrders] = useState<OrderModel[]>([]);
    const [isLoading, setIsLoading] = useState<any>(true);
    const [deliveries, setDeliveries] = useState<any[]>();
    const [limitCount, setLimitCount] = useState(10);
    const [open, setOpen] = useState(false);
    const [isRequire, setIsRequire] = useState(false);
    const [isConfirm, setIsConfirm] = useState(false);
    const [isCopyOrder, setIsCopyOrder] = useState(false);
    const [isCancelOrder, setIsCancelOrder] = useState(false);
    const { changeTab } = useTabStore();
    const { order, setOrder } = useSelectOrder();
    const mounted = useRef(false);
    const orderIds = useRef(conversation?.go24OrderIds);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const openExpand = Boolean(anchorEl);
    const { setIsOpenAlert, setAlert, setType } = useAlertStore();

    useEffect(() => {
        mounted.current = true;
        init();
        return (() => {
            mounted.current = false;
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        orderIds.current = conversation?.go24OrderIds;
        if (orders?.length > 0) {
            handleGetOrder()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [limitCount, conversation])
    useEffect(() => {
        if (orders?.length > 0 && deliveries?.length > 0 && !isLoading) {
            const _orders = orders?.map(order => {
                let partnerDelivery = deliveries?.find(d => d.id === order.partnerDeliveryId);
                let showAction: ShowActionModel = {} as ShowActionModel;
                if (partnerDelivery) {
                    order = {
                        ...order,
                        partnerDeliveryName: partnerDelivery.name,
                    }
                }
                switch (order.statusId) {
                    case OrderStatus.WaitingConfirm:
                        showAction = {
                            ...showAction,
                            isShowConfirm: true,
                            isShowCancel: true,
                            isShowReCreate: true,
                            isShowEdit: true,
                            isShowMore: false
                        }
                        break;
                    case OrderStatus.WaitingTakeOrder:
                        showAction = {
                            ...showAction,
                            isShowConfirm: false,
                            isShowCancel: true,
                            isShowReCreate: true,
                            isShowEdit: true,
                            isShowMore: true
                        }
                        break;
                    case OrderStatus.PickedUp:
                        showAction = {
                            ...showAction,
                            isShowConfirm: false,
                            isShowCancel: false,
                            isShowReCreate: true,
                            isShowEdit: true,
                            isShowMore: true
                        }
                        break;
                    case OrderStatus.Transporting:
                        showAction = {
                            ...showAction,
                            isShowConfirm: false,
                            isShowCancel: false,
                            isShowReCreate: true,
                            isShowEdit: true,
                            isShowMore: true
                        }
                        break;
                    case OrderStatus.Stored:
                        showAction = {
                            ...showAction,
                            isShowConfirm: false,
                            isShowCancel: false,
                            isShowReCreate: true,
                            isShowEdit: true,
                            isShowMore: true
                        }
                        break;
                    case OrderStatus.Delivering:
                        showAction = {
                            ...showAction,
                            isShowConfirm: false,
                            isShowCancel: false,
                            isShowReCreate: true,
                            isShowEdit: true,
                            isShowMore: true
                        }
                        break;
                    case OrderStatus.Deliveried:
                        showAction = {
                            ...showAction,
                            isShowConfirm: false,
                            isShowCancel: false,
                            isShowReCreate: true,
                            isShowEdit: false,
                            isShowMore: true
                        }
                        break;
                    case OrderStatus.WaitingReturn:
                        showAction = {
                            ...showAction,
                            isShowConfirm: false,
                            isShowCancel: false,
                            isShowReCreate: true,
                            isShowEdit: false,
                            isShowMore: true
                        }
                        break;
                    case OrderStatus.Returned:
                        showAction = {
                            ...showAction,
                            isShowConfirm: false,
                            isShowCancel: false,
                            isShowReCreate: true,
                            isShowEdit: false,
                            isShowMore: true
                        }
                        break;
                    case OrderStatus.Reimbursement:
                        showAction = {
                            ...showAction,
                            isShowConfirm: false,
                            isShowCancel: false,
                            isShowReCreate: true,
                            isShowEdit: false,
                            isShowMore: true
                        }
                        break;
                    case OrderStatus.Canceled:
                        showAction = {
                            ...showAction,
                            isShowConfirm: false,
                            isShowCancel: false,
                            isShowReCreate: true,
                            isShowEdit: false,
                            isShowMore: true
                        }
                        break;

                }
                return { ...order, showAction }

            })
            setOrders(_orders);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [deliveries, isLoading])
    const handleClickExpand = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = async (status?: number) => {
        setAnchorEl(null);
    };
    const handleGetOrder = async () => {
        orderIds.current = conversation?.go24OrderIds.sort((a, b) => parseInt(b) - parseInt(a));
        if (orderIds.current?.length > 0) {
            let _orders = [...orders];
            let responses = [];
            for (let index = _orders.length; index < limitCount; index++) {
                if (!orderIds.current[index]) break;
                responses.push(Go24Repository.GetOrderDetail(orderIds.current[index]));
            }
            const responsesArray = await Promise.all(responses);
            responsesArray.map(response => {
                if (response && response.code === 'Success' && response.result === 0 && response.data) {
                    _orders = [..._orders, response.data];
                }
                return response;
            })
            setOrders(_orders);
        }
    }
    const getDeliveries = async () => {
        let response = await Go24Repository.GetDeliveries();
        if (response && response.code === 'Success' && response.data) {
            setDeliveries(response.data);
        }
    }
    const init = async () => {
        setIsLoading(true);
        await Promise.all([getDeliveries(), handleGetOrder()]);
        setIsLoading(false);
    }
    const renderPartnerDilevery = (partnerDeliveryId: number) => {
        let partnerDelivery = deliveries.find(dp => dp.id === partnerDeliveryId);
        if (partnerDelivery) return partnerDelivery.name;
    }
    const renderStatus = (statusId: number) => {
        let status = '';
        switch (statusId) {
            case OrderStatus.ReimbursementDelivery:
                status = OrderStatusText.ReimbursementDelivery;
                break;
            case OrderStatus.Reimbursement:
                status = OrderStatusText.Reimbursement;
                break;
            case OrderStatus.Canceled:
                status = OrderStatusText.Canceled;
                break;
            case OrderStatus.WaitingConfirm:
                status = OrderStatusText.WaitingConfirm;
                break;
            case OrderStatus.WaitingTakeOrder:
                status = OrderStatusText.WaitingTakeOrder;
                break;
            case OrderStatus.Delivering:
                status = OrderStatusText.Delivering;
                break;
            case OrderStatus.Deliveried:
                status = OrderStatusText.Deliveried;
                break;
            case OrderStatus.WaitingReturn:
                status = OrderStatusText.WaitingReturn;
                break;
            case OrderStatus.Returned:
                status = OrderStatusText.Returned;
                break;
            case OrderStatus.DeliveryFailed:
                status = OrderStatusText.DeliveryFailed;
                break;
            case OrderStatus.Incident:
                status = OrderStatusText.Incident;
                break;
            case OrderStatus.PickedUp:
                status = OrderStatusText.PickedUp;
                break;
            case OrderStatus.Transporting:
                status = OrderStatusText.Transporting;
                break;
            case OrderStatus.Stored:
                status = OrderStatusText.Stored;
                break;
            case OrderStatus.PartiallyReturning:
                status = OrderStatusText.PartiallyReturning;
                break;
            case OrderStatus.PartiallyDelivered:
                status = OrderStatusText.PartiallyDelivered;
                break;
            case OrderStatus.PartiallyReturned:
                status = OrderStatusText.PartiallyReturned;
                break;
        }
        return translate(status, status);
    }
    const renderOrderPaidStatuses = (statusId: number) => {
        let status = '';
        switch (statusId) {
            case OrderPaidStatuses.None:
                status = OrderPaidStatusesText.None;
                break;
            case OrderPaidStatuses.NotPaid:
                status = OrderPaidStatusesText.NotPaid;
                break;
            case OrderPaidStatuses.WaitingPaid:
                status = OrderPaidStatusesText.WaitingPaid;
                break;
            case OrderPaidStatuses.Done:
                status = OrderPaidStatusesText.Done;
                break;
        }
        return translate(status, status);

    }
    const renderDeliveryStatuses = (statusId: number) => {
        let status = '';
        switch (statusId) {
            case DeliveryStatus.None:
                status = DeliveryStatusText.None;
                break;
            case DeliveryStatus.DelayPickup:
                status = DeliveryStatusText.DelayPickup;
                break;
            case DeliveryStatus.DelayDelivery:
                status = DeliveryStatusText.DelayDelivery;
                break;
            case DeliveryStatus.WeightChanged:
                status = DeliveryStatusText.WeightChanged;
                break;
            case DeliveryStatus.ReturnPartPackage:
                status = DeliveryStatusText.ReturnPartPackage;
                break;
            case DeliveryStatus.RetryDelivery:
                status = DeliveryStatusText.RetryDelivery;
                break;
            case DeliveryStatus.DeliveryFailed:
                status = DeliveryStatusText.DeliveryFailed;
                break;
            case DeliveryStatus.Delivering:
                status = DeliveryStatusText.Delivering;
                break;
            case DeliveryStatus.Delivered:
                status = DeliveryStatusText.Delivered;
                break;
        }
        return translate(status, status);
    }
    const renderCODStatuses = (statusId: number) => {
        let status = '';
        switch (statusId) {
            case CODStatuses.None:
                status = CODStatusesText.None;
                break;
            case CODStatuses.WaitingCOD:
                status = CODStatusesText.WaitingCOD;
                break;
            case CODStatuses.Done:
                status = CODStatusesText.Done;
                break;
        }
        return translate(status, status);
    }
    const renderType = (typeId: number) => {
        let _type = types.find(t => t.value === typeId);
        return _type ? _type.name : '';
    }
    const renderTypeShowItem = (typeShowItemId: number) => {
        let _typeShowItem = typeShowItem.find(t => t.value === typeShowItemId);
        return _typeShowItem ? _typeShowItem.name : '';
    }
    const handleClick = (order: OrderModel) => {
        setOrder(order);
        setOpen(true);
    }
    const handleConfirm = (order: OrderModel) => {
        setOrder(order);
        setIsConfirm(true);
        apiPostGo24('/order/confirm', {
            orderId: order.id
        }, (rs3) => {
            if (rs3.data?.code === 'Fail' && rs3.data?.data) {
                setAlert(translate('', rs3.data?.errorMessage));
                setType('error');
                setIsOpenAlert(true);
            } else if (rs3.data?.code === 'Success') {
                setAlert(translate('', 'Xác nhận thành công'));
                setType('success');
                setIsOpenAlert(true);
            }
            setIsConfirm(false);
        })
    }
    const handleSetCopyOrder = (order: OrderModel) => {
        setOrder(order);
        setIsCopyOrder(true);
    }
    const handleReOrder = async () => {
        setIsCopyOrder(false);
        // let response = await Go24Repository.ReOrder(order?.id);
    }
    const handleSetCancelOrder = (order: OrderModel) => {
        setOrder(order);
        setIsCancelOrder(true);
    }
    const handleCancelOrder = async () => {
        setIsCancelOrder(false);
        let response = await Go24Repository.CancelOrder(order?.id);
        if (response?.code === 'Success') {
            setType('success');
            setAlert(translate('orders.Hủy đơn thành công', 'Hủy đơn thành công'));
        } else {
            setAlert(translate(response?.errorMessage, response?.errorMessage));
            setType('error');
        }
        setIsOpenAlert(true);
    }
    const hanldeRequireOrder = async (order, status) => {
        setOrder(order);
        let statusText = '';
        switch (status) {
            case RequireOrder.ReDelivery:
                statusText = 'giao lại';
                break;
            case RequireOrder.Complain:
                statusText = 'khiếu nại';
                break;
            case RequireOrder.Reschedule:
                statusText = 'hẹn ngày giao';
                break;
            case RequireOrder.Return:
                statusText = 'duyệt hoàn';
                break;
        }
        setMesRequire({ ...mesRequire, statusText, status });
        setIsRequire(true);
        setAnchorEl(null);
    }
    const handleSendRequireOrder = async () => {
        let data = {
            input: {}
        }
        switch (mesRequire?.status) {
            case RequireOrder.ReDelivery:
                data = {
                    input: {
                        requestType: RequireOrder.ReDelivery,
                        orderCode: order?.code,
                        orderId: order?.id,
                        requestMessage: `Shop yêu cầu giao lại. ${mesRequire?.content}`
                    }
                }
                break;
            case RequireOrder.Complain:
                data = {
                    input: {
                        requestType: RequireOrder.Complain,
                        orderCode: order?.code,
                        orderId: order?.id,
                        requestMessage: mesRequire?.content
                    }
                }
                break;
            case RequireOrder.Reschedule:
                data = {
                    input: {
                        requestType: RequireOrder.Reschedule,
                        orderCode: order?.code,
                        orderId: order?.id,
                        requestMessage: mesRequire?.content
                    }
                }
                break;
            case RequireOrder.Return:
                data = {
                    input: {
                        requestType: RequireOrder.Return,
                        orderCode: order.code,
                        orderId: order.id,
                        requestMessage: `Shop yêu cầu hoàn hàng - ${mesRequire?.content}`
                    }
                }
                break;
        }
        const response = await Go24Repository.SendOrderRequest(data);
        if (response?.code === 'Success') {
            setType('success');
            setAlert(translate('orders.Gửi yêu cầu thành công', 'Gửi yêu cầu thành công'));
        } else {
            setAlert(translate(response?.errorMessage, 'Gửi yêu cầu thất bại'));
            setType('error');
        }
        setMesRequire(null);
        setIsOpenAlert(true);
        setIsRequire(false);
    }
    const copyToClipboard = async (text: string, message: string) => {
        await navigator.clipboard.writeText(text);
        setAlert(translate(`orders.Đã sao chép ${message} vào bộ nhớ tạm`, `Đã sao chép ${message} vào bộ nhớ tạm`));
        setType('success');
        setIsOpenAlert(true);
    };

    return <Box sx={{ backgroundColor: theme.color1, width: '100%' }}>
        {isLoading ? <Loader /> :
            <>
                <Text sx={{
                    textAlign: 'center',
                    color: theme.mainColor,
                    backgroundColor: theme.textColor,
                    py: 1,
                    fontWeight: 500
                }}>
                    <FormattedMessage id="orders.Danh sách đơn hàng"
                        defaultMessage="Danh sách đơn hàng" />
                </Text>
                <Box sx={{ color: theme.color, width: '100%', height: '100%', overflowY: 'auto' }}>

                    <Stack
                        id='orders-content' sx={{
                            overflowY: 'auto',
                            height: '88vh',
                            '@media (max-width:1700px)': {
                                height: '85vh',
                            },

                        }}
                    >
                        {orders?.length > 0 ? <InfiniteScroll
                            dataLength={orders?.length as number}
                            next={() => setLimitCount((prev) => prev + 5)}
                            hasMore={(orders?.length as number) >= limitCount}
                            loader={<h4>Loading...</h4>}
                            style={{ display: 'flex', flexDirection: 'column', overflow: 'unset' }}
                            scrollableTarget="orders-content"
                        >
                            {orders?.map((_order, index) => (
                                <Box sx={{
                                    mb: 2,
                                    backgroundColor: theme.navColor,
                                    p: 1,
                                    borderRadius: '10px',
                                    position: 'relative'

                                }}>
                                    <Box onClick={() => handleClick(_order)}
                                        sx={{
                                            cursor: 'pointer',
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                        }}>

                                    </Box>
                                    <Stack sx={{
                                        pb: 0.5, width: '100%',
                                    }} justifyContent="space-between" key={`${_order?.id}${index}`}>
                                        <Stack direction="row" sx={{ ml: 1 }} alignItems="center">
                                            {_order.partnerDeliveryId === 1 && <>
                                                <Avatar sx={{ borderRadius: '5px', width: 40, height: 40 }}
                                                    src={Ninjavan} ><PhotoIcon sx={{ width: 40, height: 40 }} />
                                                </Avatar>
                                            </>}
                                            {_order.partnerDeliveryId === 3 && <Avatar sx={{ borderRadius: '5px', width: 80, height: 40 }}
                                                src={GHN} ><PhotoIcon sx={{ width: 40, height: 40 }} />
                                            </Avatar>}
                                            {_order.partnerDeliveryId === 4 && <Avatar sx={{ borderRadius: '5px', width: 40, height: 40 }}
                                                src={GHTK} ><PhotoIcon sx={{ width: 40, height: 40 }} />
                                            </Avatar>}
                                            {_order.partnerDeliveryId === 11 && <Avatar sx={{ borderRadius: '5px', width: 40, height: 40 }}
                                                src={BestExpress} ><PhotoIcon sx={{ width: 40, height: 40 }} />
                                            </Avatar>}
                                            <Typography variant="subtitle1"
                                                sx={{ textTransform: 'capitalize', ml: 1, fontWeight: 500 }}
                                            >
                                                {renderPartnerDilevery(_order.partnerDeliveryId)} - {renderStatus(_order.statusId)}
                                            </Typography>
                                        </Stack>
                                        {_order?.deliveryCode ?
                                            <Stack direction="row" alignItems="center">
                                                <Typography variant="h6" color="error">
                                                    {_order.deliveryCode}
                                                </Typography>
                                                <IconButton onClick={() => copyToClipboard(_order.deliveryCode, 'mã vận đơn')} >
                                                    <ContentCopyIcon sx={{ fontSize: 20 }} />
                                                </IconButton>
                                            </Stack>
                                            :
                                            <Typography variant="h6" color="error">
                                                {translate('orders.Chưa tạo đơn', 'Chưa tạo đơn')}
                                            </Typography>
                                        }
                                        <Stack direction="row">
                                            <Stack direction="row" sx={{ mr: 2 }} alignItems="center">
                                                <PermIdentityIcon sx={{ mr: 1, fontSize: 18 }} />
                                                <Text variant="subtitle1">
                                                    {_order.fullName}
                                                </Text>
                                            </Stack>
                                            <Stack direction="row" alignItems="center">
                                                <LocalPhoneIcon sx={{ mr: 1, fontSize: 18 }} />
                                                <Text variant="subtitle1">
                                                    {_order.phoneNumber}
                                                </Text>
                                                <IconButton onClick={() => copyToClipboard(_order.phoneNumber, 'số điện thoại')} >
                                                    <ContentCopyIcon sx={{ fontSize: 18 }} />
                                                </IconButton>
                                            </Stack>
                                        </Stack>
                                        <Stack sx={{ borderTop: `1px solid ${theme.borderColor}`, pt: 1 }}>
                                            <Stack direction="row" spacing={1} justifyContent="space-between" >
                                                <Text sx={{ fontWeight: 500 }}>
                                                    <FormattedMessage id="orders.Tổng thu người nhận"
                                                        defaultMessage="Tổng thu người nhận" />
                                                </Text>
                                                <Typography sx={{
                                                    textTransform: 'lowercase',
                                                    color: '#f1aa48',
                                                    fontWeight: 500
                                                }}>{formatNumber(_order?.totalTakenCustomerAmount)}</Typography>
                                            </Stack>
                                            <Stack direction="row" spacing={1} justifyContent="space-between" >
                                                <Text sx={{ fontWeight: 500 }}>
                                                    <FormattedMessage id="orders.Thanh toán cho Shop"
                                                        defaultMessage="Thanh toán cho Shop" />
                                                </Text>
                                                <Typography sx={{
                                                    textTransform: 'lowercase',
                                                    color: '#db5d59',
                                                    fontWeight: 500
                                                }} >{formatNumber(_order?.totalPaidShopAmount)}</Typography>
                                            </Stack>
                                        </Stack>

                                        <Stack direction="row"
                                            sx={{
                                                borderTop: `1px solid ${theme.borderColor}`,
                                                borderBottom: `1px solid ${theme.borderColor}`,
                                                py: 1,
                                            }}
                                        >
                                            <Typography variant="body2" sx={{ color: theme.smallColor, textAlign: 'left', mr: 1 }}>
                                                {formatDate(_order.modifiedDate
                                                )}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                    {_order.id === order.id && isConfirm ? <LinearProgress color="primary" /> : <Stack direction="row" sx={{ width: '100%', mb: 1 }} justifyContent="space-around">
                                        {_order?.showAction?.isShowConfirm && <IconButton onClick={() => handleConfirm(_order)} >
                                            <CheckCircleOutlineIcon color="success" />
                                        </IconButton>}
                                        {_order?.showAction?.isShowCancel && <IconButton onClick={() => handleSetCancelOrder(_order)} >
                                            <CancelIcon sx={{ color: '#d32f2f' }} />
                                        </IconButton>}
                                        {_order?.showAction?.isShowReCreate && <IconButton onClick={() => handleSetCopyOrder(_order)}>
                                            <FileCopyIcon
                                                sx={{ color: '#ffc50a' }} />
                                        </IconButton>}
                                        {_order?.showAction?.isShowEdit && <IconButton onClick={() => { changeTab(TabInfo.CreateOrder, true); setOrder(_order) }}>
                                            <EditIcon color="primary" />
                                        </IconButton>}
                                        {_order?.showAction?.isShowMore && <IconButton onClick={handleClickExpand}>
                                            <InfoIcon sx={{ color: 'purple' }}
                                            />
                                        </IconButton>}
                                        <Menu
                                            id="fade-menu"
                                            MenuListProps={{
                                                'aria-labelledby': 'fade-button',
                                            }}
                                            anchorEl={anchorEl}
                                            open={openExpand}
                                            onClose={() => handleClose()}
                                            TransitionComponent={Fade}
                                            sx={{
                                                '.MuiMenu-paper.MuiPaper-elevation': {
                                                    backgroundColor: theme.navColor,
                                                }
                                            }}
                                        >
                                            <MenuItem onClick={() => hanldeRequireOrder(_order, RequireOrder.ReDelivery)}>
                                                <Typography component="span">
                                                    <FormattedMessage
                                                        id="orders.Giao lại"
                                                        defaultMessage="Giao lại" />
                                                </Typography>
                                            </MenuItem>
                                            <MenuItem onClick={() => hanldeRequireOrder(_order, RequireOrder.Complain)}>
                                                <Typography component="span">
                                                    <FormattedMessage
                                                        id="orders.Khiếu nại"
                                                        defaultMessage="Khiếu nại" />
                                                </Typography>
                                            </MenuItem>
                                            <MenuItem onClick={() => hanldeRequireOrder(_order, RequireOrder.Reschedule)}>
                                                <Typography component="span">
                                                    <FormattedMessage
                                                        id="orders.Hẹn ngày giao"
                                                        defaultMessage="Hẹn ngày giao" />
                                                </Typography>
                                            </MenuItem>
                                            <MenuItem onClick={() => hanldeRequireOrder(_order, RequireOrder.Return)}>
                                                <Typography component="span">
                                                    <FormattedMessage
                                                        id="orders.Duyệt hoàn"
                                                        defaultMessage="Duyệt hoàn" />
                                                </Typography>
                                            </MenuItem>
                                        </Menu>
                                    </Stack>}
                                </Box>
                            ))}
                        </InfiniteScroll> : <Box sx={{
                            height: '100%',
                            width: '100%',
                            padding: '20px'
                        }}>
                            <OrderWrapper spacing={2}>
                                <Stack direction="row" spacing={2}>
                                    <Typography variant="body1" sx={{ color: theme.color }}><FormattedMessage
                                        id="infoOrder.Chưa có đơn hàng nào!" defaultMessage="Chưa có đơn hàng nào!"
                                    /></Typography>
                                </Stack>
                                <Text variant="subtitle1" sx={{ color: theme.noteColor, marginBottom: '20px' }}><FormattedMessage
                                    id="infoOrder.Tiết kiệm chi phí giao nhận với hệ thống quản lý đơn hàng tập trung, tích hợp sẵn các nhà vận chuyển phổ biến." defaultMessage="Tiết kiệm chi phí giao nhận với hệ thống quản lý đơn hàng tập trung, tích hợp sẵn các nhà vận chuyển phổ biến."
                                />
                                </Text>
                                <Box>
                                    <Button onClick={() => changeTab(TabInfo.CreateOrder)}><FormattedMessage
                                        id="infoOrder.+ Thêm đơn hàng"
                                        defaultMessage="+ Thêm đơn hàng"
                                    />
                                    </Button>
                                </Box>
                            </OrderWrapper>
                        </Box>}
                    </Stack>
                </Box>
            </>
        }
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            aria-describedby="orders-modal-description"
        >
            <Box sx={{
                position: "absolute",
                left: '50%',
                top: '50%',
                width: '50%',
                transform: 'translate(-50%, -50%)',
            }}>
                <Card id="orders-modal-description" sx={{
                    color: theme.color,
                    backgroundColor: theme.bgColor,
                }}>
                    <CardContent
                        sx={{
                            maxHeight: '95vh',
                            overflowY: 'scroll',
                        }}
                    >
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Stack direction="row" sx={{ ml: 3 }} alignItems="center">
                                {order?.partnerDeliveryId === 1 && <Avatar sx={{ borderRadius: '5px', width: 40, height: 40 }}
                                    src={Ninjavan} ><PhotoIcon sx={{ width: 40, height: 40 }} />
                                </Avatar>}
                                {order?.partnerDeliveryId === 3 && <Avatar sx={{ borderRadius: '5px', width: 80, height: 40 }}
                                    src={GHN} ><PhotoIcon sx={{ width: 40, height: 40 }} />
                                </Avatar>}
                                {order?.partnerDeliveryId === 4 && <Avatar sx={{ borderRadius: '5px', width: 40, height: 40 }}
                                    src={GHTK} ><PhotoIcon sx={{ width: 40, height: 40 }} />
                                </Avatar>}
                                {order?.partnerDeliveryId === 11 && <Avatar sx={{ borderRadius: '5px', width: 40, height: 40 }}
                                    src={BestExpress} ><PhotoIcon sx={{ width: 40, height: 40 }} />
                                </Avatar>}
                                <Typography variant="h6" component="h2" sx={{ mx: 1 }}>- <FormattedMessage
                                    id="infoOrder.Chi tiết đơn hàng"
                                    defaultMessage="Chi tiết đơn hàng"
                                />
                                </Typography>
                                <Typography variant="h6" color="error">
                                    {order?.deliveryCode ? order?.deliveryCode : ''}
                                </Typography>
                            </Stack>
                            <Typography variant="h6" component="h2">
                                {renderStatus(order?.statusId)}
                            </Typography>
                        </Stack>

                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="subtitle1" sx={{ color: 'gray' }}>
                                {formatDate(order?.modifiedDate)}
                            </Typography>
                            <Typography variant="h6" component="h2">
                                {formatNumber(order?.totalTakenCustomerAmount)}
                            </Typography>
                        </Stack>
                        <Divider />
                        <Stack>
                            <Typography variant="h6" component="h2"><FormattedMessage
                                id="infoOrder.Trạng thái"
                                defaultMessage="Trạng thái"
                            />
                            </Typography>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="body1" sx={{ color: 'gray' }}>
                                    <FormattedMessage
                                        id="infoOrder.Trạng thái giao hàng"
                                        defaultMessage="Trạng thái giao hàng"
                                    />
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'gray' }}>
                                    {renderDeliveryStatuses(order?.paidStatusId)}
                                </Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="body1" sx={{ color: 'gray' }}>
                                    <FormattedMessage
                                        id="infoOrder.Trạng thái thanh toán"
                                        defaultMessage="Trạng thái thanh toán"
                                    />
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'gray' }}>
                                    {renderOrderPaidStatuses(order?.paidStatusId)}
                                </Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="body1" sx={{ color: 'gray' }}>
                                    <FormattedMessage
                                        id="infoOrder.Trạng thái ứng tiền"
                                        defaultMessage="Trạng thái ứng tiền"
                                    />
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'gray' }}>
                                    {renderCODStatuses(order?.codStatusId)}
                                </Typography>
                            </Stack>
                        </Stack>
                        <Divider />
                        <Stack>
                            <Typography variant="h6" component="h2"><FormattedMessage
                                id="infoOrder.Thông tin người gửi"
                                defaultMessage="Thông tin người gửi"
                            />
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'gray' }}>
                                {`${order?.shopLocationName} - ${order?.shopLocationPhoneNumber}`}
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'gray' }}>
                                {`${order?.shopLocationAddress}, ${order?.shopLocationWardName}, ${order?.shopLocationDistrictName}, ${order?.shopLocationProvinceName}`}
                            </Typography>
                        </Stack>
                        <Divider />
                        <Stack>
                            <Typography variant="h6" component="h2"><FormattedMessage
                                id="infoOrder.Thông tin người nhận"
                                defaultMessage="Thông tin người nhận"
                            />
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'gray' }}>
                                {`${order?.fullName} - ${order?.phoneNumber}`}
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'gray' }}>
                                {`${order?.address}, ${order?.wardName}, ${order?.districtName}, ${order?.provinceName}`}
                            </Typography>
                        </Stack>
                        <Divider />
                        <Stack>
                            <Typography variant="h6" component="h2"><FormattedMessage
                                id="infoOrder.Sản phẩm"
                                defaultMessage="Sản phẩm"
                            />
                            </Typography>
                            <List>
                                {order?.items?.map((item, index) => (
                                    <ListItem disablePadding key={`${item.id}${index}`}>
                                        <Stack direction="row" justifyContent="space-between" sx={{ width: '100%', mb: 1 }}>
                                            <Stack direction="row">
                                                <ListItemIcon>
                                                    <Avatar sx={{ borderRadius: '5px', width: 40, height: 40 }}
                                                        src={`${config.baseGo24Url}${item?.imageUrl}`} ><PhotoIcon sx={{ width: 40, height: 40 }} />
                                                    </Avatar>
                                                </ListItemIcon>
                                                <Typography variant="body1" sx={{ color: 'gray' }}>
                                                    {item.name}
                                                </Typography>
                                            </Stack>
                                            <Typography variant="body1">
                                                {item.quantity} x {formatNumber(item.retailPrice)}
                                            </Typography>
                                        </Stack>
                                    </ListItem>
                                ))}
                            </List>
                            <Divider />
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="body1" sx={{ color: 'gray' }}>
                                    <FormattedMessage
                                        id="orders.Loại sản phẩm"
                                        defaultMessage="Loại sản phẩm"
                                    />
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'gray' }}>
                                    {renderType(order?.type)}
                                </Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="body1" sx={{ color: 'gray' }}>
                                    <FormattedMessage
                                        id="orders.Khối lượng"
                                        defaultMessage="Khối lượng"
                                    />
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'gray' }}>
                                    {order?.weight} (kg)
                                </Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="body1" sx={{ color: 'gray' }}>
                                    <FormattedMessage
                                        id="orders.Kích thước"
                                        defaultMessage="Kích thước"
                                    />
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'gray' }}>
                                    {`${order?.length} x ${order?.width} x ${order?.height} (cm3)`}
                                </Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="body1" sx={{ color: 'gray' }}>
                                    <FormattedMessage
                                        id="orders.Tiền thu hộ"
                                        defaultMessage="Tiền thu hộ"
                                    />
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'gray' }}>
                                    {formatNumber(order?.collectMoney)}
                                </Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="body1" sx={{ color: 'gray' }}>
                                    <FormattedMessage
                                        id="orders.Phí vận chuyển"
                                        defaultMessage="Phí vận chuyển"
                                    />
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'gray' }}>
                                    {formatNumber(order?.deliveryAmount)}
                                </Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="body1" sx={{ color: 'gray' }}>
                                    <FormattedMessage
                                        id="orders.Phí bảo hiểm"
                                        defaultMessage="Phí bảo hiểm"
                                    />
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'gray' }}>
                                    {formatNumber(order?.insurranceFee)}
                                </Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="body1" sx={{ color: 'gray' }}>
                                    <FormattedMessage
                                        id="orders.Phí ứng COD"
                                        defaultMessage="Phí ứng COD"
                                    />
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'gray' }}>
                                    {formatNumber(order?.codFeeAmount)}
                                </Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="body1" sx={{ color: 'gray' }}>
                                    <FormattedMessage
                                        id="orders.Phí phát sinh"
                                        defaultMessage="Phí phát sinh"
                                    />
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'gray' }}>
                                    {formatNumber(order?.totalIncurredCost)}
                                </Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="body1" sx={{ color: 'gray' }}>
                                    <FormattedMessage
                                        id="orders.Giá trị bảo hiểm"
                                        defaultMessage="Giá trị bảo hiểm"
                                    />
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'gray' }}>
                                    {formatNumber(order?.insurranceAmount)}
                                </Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="body1" sx={{ color: 'gray' }}>
                                    <FormattedMessage
                                        id="orders.Mã voucher"
                                        defaultMessage="Mã voucher"
                                    />
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'gray' }}>
                                    {order?.voucherCode}
                                </Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="body1" sx={{ color: 'gray' }}>
                                    <FormattedMessage
                                        id="orders.Ghi chú"
                                        defaultMessage="Ghi chú"
                                    />
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'gray' }}>
                                    {order?.note}
                                </Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography variant="body1" sx={{ color: 'gray' }}>
                                    <FormattedMessage
                                        id="orders.Kiểu xem hàng"
                                        defaultMessage="Kiểu xem hàng"
                                    />
                                </Typography>
                                <Typography variant="body1" sx={{ color: 'gray' }}>
                                    {renderTypeShowItem(order?.typeShowItem)}
                                </Typography>
                            </Stack>
                        </Stack>
                        <Box sx={{ p: 1 }}>
                            <Box sx={{ border: `1px solid ${theme.borderColor}`, borderRadius: '5px', mb: 1, p: 1 }}>
                                <Stack direction="row" spacing={1} justifyContent="space-between" >
                                    <Text>
                                        <FormattedMessage id="orders.Tổng tiền hàng"
                                            defaultMessage="Tổng tiền hàng" />
                                    </Text>
                                    <Typography>{formatNumber(order?.totalTakenCustomerAmount)}</Typography>
                                </Stack>
                                {/* <Stack direction="row" spacing={1} justifyContent="space-between" >
                                    <Text>
                                        <FormattedMessage id="orders.Phí bảo hiểm"
                                            defaultMessage="Phí bảo hiểm" />
                                    </Text>
                                    <Text>{formatNumber(order?.insurranceAmount)}</Text>
                                </Stack> */}
                                <Stack direction="row" spacing={1} justifyContent="space-between" >
                                    <Text>
                                        <FormattedMessage id="orders.Phí vận chuyển"
                                            defaultMessage="Phí vận chuyển" />
                                    </Text>
                                    <Typography>{formatNumber(order?.deliveryAmount)}</Typography>
                                </Stack>
                                <Stack direction="row" spacing={1} justifyContent="space-between" >
                                    <Text sx={{ fontWeight: 500 }}>
                                        <FormattedMessage id="orders.Thanh toán cho Shop"
                                            defaultMessage="Thanh toán cho Shop" />
                                    </Text>
                                    <Typography>{formatNumber(order?.totalPaidShopAmount)}</Typography>
                                </Stack>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Modal>
        <Modal
            open={isCopyOrder}
            onClose={() => setIsCopyOrder(false)}
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
                            id="infoOrder.Bạn muốn tạo một đơn hàng mới giống đơn này?"
                            defaultMessage="Bạn muốn tạo một đơn hàng mới giống đơn này?"
                        /></Typography>
                        <Stack direction="row" justifyContent="right">
                            <ButtonM onClick={() => setIsCopyOrder(false)} color="error"><FormattedMessage
                                id="infoOrder.Hủy"
                                defaultMessage="Hủy"
                            /></ButtonM>
                            <ButtonM onClick={handleReOrder} color="primary"><FormattedMessage
                                id="infoOrder.Xác nhận"
                                defaultMessage="Xác nhận"
                            /></ButtonM>
                        </Stack>
                    </CardContent>
                </Card>
            </Box>
        </Modal>
        <Modal
            open={isCancelOrder}
            onClose={() => setIsCancelOrder(false)}
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
                            id="infoOrder.Bạn có chắc chắn muốn hủy đơn này?"
                            defaultMessage="Bạn có chắc chắn muốn hủy đơn này?"
                        /></Typography>
                        <Stack direction="row" justifyContent="right">
                            <ButtonM onClick={() => setIsCancelOrder(false)} color="error"><FormattedMessage
                                id="infoOrder.Hủy"
                                defaultMessage="Hủy"
                            /></ButtonM>
                            <ButtonM onClick={handleCancelOrder} color="primary"><FormattedMessage
                                id="infoOrder.Xác nhận"
                                defaultMessage="Xác nhận"
                            /></ButtonM>
                        </Stack>
                    </CardContent>
                </Card>
            </Box>
        </Modal>
        <Modal
            open={isRequire}
            onClose={() => setIsRequire(false)}
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
                        {mesRequire?.statusText && <Typography variant="h6" component="h2"><FormattedMessage
                            id={`infoOrder.Gửi yêu cầu ${mesRequire?.statusText}`}
                            defaultMessage={`Gửi yêu cầu ${mesRequire?.statusText}`}
                        /></Typography>}
                        <TextField
                            sx={{ my: 2 }}
                            name="mesRequire"
                            fullWidth
                            value={mesRequire?.content}
                            label={translate('orders.Nhập ghi chú...', 'Nhập ghi chú...')}
                            multiline
                            onChange={e =>
                                setMesRequire({ ...mesRequire, content: e.target?.value })}
                        />
                        <Stack direction="row" justifyContent="right">
                            <ButtonM onClick={() => setIsRequire(false)} color="error"><FormattedMessage
                                id="infoOrder.Hủy"
                                defaultMessage="Hủy"
                            /></ButtonM>
                            <ButtonM onClick={handleSendRequireOrder} color="primary"><FormattedMessage
                                id="infoOrder.Xác nhận"
                                defaultMessage="Xác nhận"
                            /></ButtonM>
                        </Stack>
                    </CardContent>
                </Card>
            </Box>
        </Modal>
    </Box>


}

export default Orders