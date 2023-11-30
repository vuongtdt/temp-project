import { setHeadersGo24 } from 'helper/setHeaders';
import { useLocalStorage } from 'lib/component/Hook/useLocalStorage';
import React, { Fragment, useEffect } from 'react';
import { useTabStore } from '../../store/changeTabStore';
import Information from './Information';
import OrderForm from './OrderForm';
import Orders from './Orders';
import { Stack } from '@mui/material';
import { useChatStore } from 'store/chatStore';
type Props = {}

const InfoOrder = (props: Props) => {
  const { tab } = useTabStore();
  const { getItem } = useLocalStorage();
  const { theme } = useChatStore();
  useEffect(() => {
    setHeadersGo24(getItem('accessToken'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Fragment>
      <Stack sx={{
        borderRadius: '20px',
        backgroundColor: theme.color1,
        margin: '20px 20px 20px 10px',
        overflow: 'hidden',
        height: '100%',
        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.15)',
        
      }}>
        {tab === 0 && <Information />}
        {tab === 1 && <OrderForm />}
        {tab === 2 && <Orders />}
      </Stack>
    </Fragment>
  )
}

export default InfoOrder