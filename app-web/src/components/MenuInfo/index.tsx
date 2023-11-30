import React, { useEffect } from 'react'
import { styled } from '@mui/material/styles';
import { useChatStore } from '../../store/chatStore';
import { Avatar, Box, IconButton, Stack, Tooltip } from '@mui/material';
import { useTabStore } from '../../store/changeTabStore';
import { TabInfo } from '../../utils/enum';
import translate from 'translations';
import InfoIcon from 'Assets/Images/re-skin/InfoIcon.png';
import CreateOrderIcon from 'Assets/Images/re-skin/CreateOrderIcon.png';
import OrdersIcon from 'Assets/Images/re-skin/OrdersIcon.png';
const MenuWrapper = styled(Stack)(() => {
  const { theme } = useChatStore();
  return {
    borderLeft: `1px solid ${theme.borderColor}`,
    display: `flex`,
  }
});

const MenuChild = styled(Box)(() => {
  const { theme } = useChatStore();
    return {
        position: 'relative',
        padding: '5px 0',
        display: 'flex',
        justifyContent: 'center',
        '&:hover, &.active': {
            backgroundColor: theme.mainColor,
            color: theme.color,
        },
        '&.active': {
            borderLeft: `2px solid ${theme.color}`,
        },
        '&.active:before': {
            position: 'absolute',
            top: '42%',
            left: '-15%',
            width: 0,
            height: 0,
            borderTop: `10px solid ${theme.textColor}`,
            borderRight: '10px solid transparent',
            content: "\"\"",
            transform: 'rotate(135deg)',
        },
        '& svg': {
            color: theme.navColor,
        }
    }
});
const IconButtonN = styled(IconButton)(() => {
  const { theme } = useChatStore();
  return {
    color: theme.color,

  }
});
type Props = {}


const MenuInfo = (props: Props) => {
  const { tab, changeTab } = useTabStore();
  useEffect(() => {
    return () => {
      changeTab(TabInfo.Info);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <MenuWrapper direction="column" alignItems="center" justifyContent="space-between" >
      <Stack sx={{ width: '100%' }}>
        <MenuChild className={tab === TabInfo.Info && 'active'} >
          <Tooltip title={translate("menuInfo.Thông tin người dùng", "Thông tin người dùng")} placement="right-start">
            <IconButtonN onClick={() => { changeTab(TabInfo.Info) }}>
              <Avatar src={InfoIcon} variant="rounded" sx={{ width: 29, height: 24 }} />
            </IconButtonN>
          </Tooltip>
        </MenuChild>
        <MenuChild className={tab === TabInfo.CreateOrder && 'active'} >
          <Tooltip title={translate("menuInfo.Tạo đơn hàng", "Tạo đơn hàng")} placement="right-start">
            <IconButtonN onClick={() => { changeTab(TabInfo.CreateOrder) }}>
              <Avatar src={CreateOrderIcon} variant="rounded" sx={{ width: 29, height: 24 }} />
            </IconButtonN>
          </Tooltip>
        </MenuChild>
        <MenuChild className={tab === TabInfo.Orders && 'active'} >
          <Tooltip title={translate("menuInfo.Danh sách đơn hàng", "Danh sách đơn hàng")} placement="right-start">
            <IconButtonN onClick={() => { changeTab(TabInfo.Orders) }}>
              <Avatar src={OrdersIcon} variant="rounded" sx={{ width: 29, height: 24 }} />
            </IconButtonN>
          </Tooltip>
        </MenuChild>
      </Stack>
    </MenuWrapper>
  )
}

export default MenuInfo