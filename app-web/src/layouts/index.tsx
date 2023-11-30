import React, { useLayoutEffect } from 'react'
import { Container, ContainerBG } from '../lib/component/Container';
import { Outlet } from 'react-router-dom';
import { Stack } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { setTokenStore } from '../store/setTokenStore';
import { useLocalStorage } from '../lib/component/Hook/useLocalStorage';
import AlertComponent from 'components/Alert';
import { useAlertStore } from '../store/alertStore';
import './index.scss';
import moment from 'moment';
import { LOGIN_URL } from 'models/constants';
import { Go24Repository } from 'repositories/Go24Repository';

const CHECK_LOGIN_DURATION = 3600000; // 1 hour

const Layout = () => {
  const { getItem, setItem } = useLocalStorage();
  const { setToken } = setTokenStore();
  const { isOpenAlert, alertText, type, setIsOpenAlert, horizontal, vertical } = useAlertStore();

  useLayoutEffect(() => {
    let code = getItem('section');
    const accessToken = getItem('accessToken');
    const accessTokenExpired = getItem('accessTokenExpired');
    if (!code) code = uuidv4();
    if (accessToken && (accessTokenExpired && moment(accessTokenExpired) <= moment().add(1, 'hours'))) {
      setItem("section", code);
      setToken(accessToken);
    } else {
      window.location.href = LOGIN_URL;
    }

    const checkLogin = setInterval(async () => {
      const session = await Go24Repository.checkLogin(accessToken);
      if (session) {
        setToken(session.data.accessToken);
        setItem('accessToken', session.data.accessToken);
        setItem('accessTokenExpired', moment().add(1, 'hours'));
      } else {
        window.location.href = LOGIN_URL;
      }
    }, CHECK_LOGIN_DURATION);
    return () => {
      clearInterval(checkLogin);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <ContainerBG>
      <Container>
        <Stack direction="row" sx={{ height: '100%' }}>
          <Outlet />
          <AlertComponent open={isOpenAlert} onClose={() => setIsOpenAlert(false)} text={alertText} type={type} horizontal={horizontal} vertical={vertical} />
        </Stack>
      </Container>
    </ContainerBG>
  )
}

export default Layout