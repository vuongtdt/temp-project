import React, { Fragment, useEffect, useState } from 'react'
import { Grid, styled, Typography } from '@mui/material';
import { useChatStore } from '../../store/chatStore';
import ConnectedList from '../../components/ConnectedList/ConnectedList';
import { useLocalStorage } from '../../lib/component/Hook/useLocalStorage';
import NotConneteds from '../../components/ConnectedList/NotConneteds';
import Loader from '../../lib/component/Loading/Loader';
import { useNavigate, useSearchParams } from 'react-router-dom';
import config from '../../config';
import { setTokenStore } from '../../store/setTokenStore';
import translate from '../../translations';
import { useAlertStore } from '../../store/alertStore';
import { apiGetChatGo24 } from '../../helper/apiHelper';
import { useTabMenuStore } from '../../store/tabMenuStore';
import { FormattedMessage } from 'react-intl';
import { useFanpagesStore } from 'store/fanpagesStore';
import fanpageBG from 'Assets/Images/re-skin/fanpageBG.png';
import LogoGO24 from 'Assets/Images/re-skin/Logo-go24.png';
import { LoadingButtonN } from 'components/re-skin';
import { Go24Repository } from "repositories/Go24Repository";
import { LOGIN_URL } from 'models/constants';
import PlatformList from 'components/ConnectedList/PlatformList';

type Props = {}
const LIMIT_FANPAGES = 10;

const Text = styled(Typography)(() => {
  const { theme } = useChatStore();
  return {
    color: theme.color,
  }
});

const Fanpages = (props: Props) => {
  const [isConnect, setIsConnect] = useState(null);
  const [isAddConnect, setIsAddConnect] = useState(null);
  const { theme } = useChatStore();
  const [dataNotConnect, setDataNotConnect] = useState<any[]>();
  const [isBtnLoading, setIsBtnLoading] = useState<boolean>(false);
  const { fanpages, setFanpages } = useFanpagesStore();
  const { getItem, setItem, removeItem } = useLocalStorage();
  const [isLoading, setIsLoading] = useState(true);
  const { setIsOpenAlert, setAlert } = useAlertStore();
  let [searchParams] = useSearchParams();
  const { token } = setTokenStore();
  const navigate = useNavigate();
  const { setTabMenu } = useTabMenuStore();

  let userIdParams = searchParams.get('userId');

  useEffect(() => {
    setTabMenu(0);
    return () => {
      setIsBtnLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (token && !userIdParams) {
      init();
    } else if (getItem('section') === searchParams.get('code')) {
      setItem('userId', userIdParams);
      getFaceBookPages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])
  const alertSettings = () => {
    setIsOpenAlert(true);
    setAlert(translate('fanpages.Đã kết nối tất cả các trang Fanpages', 'Đã kết nối tất cả các trang Fanpages'));
  }
  const getFaceBookPages = () => {
    const userId = getItem('userId');
    if (userId) {
      setIsLoading(true);
      apiGetChatGo24(`/facebook/me/pages?userId=${userId}`,
        rs1 => {
          if (!rs1?.data) return;
          let notConnects = rs1?.data.filter(r => !r.isAdded);
          if (Array.isArray(notConnects) && notConnects.length > 0) {
            setIsConnect(false);
            setDataNotConnect(notConnects);
          } else {
            if (Array.isArray(fanpages) && fanpages.length > 0) {
              alertSettings();
              setIsConnect(true);
            } else {
              apiGetChatGo24('/users/me/pages', rs2 => {
                if (rs2 && Array.isArray(rs2.data) && rs2.data.length > 0) {
                  setIsConnect(true);
                  alertSettings();
                  setFanpages(rs2.data);

                } else {
                  setIsConnect(null)
                }
              })
            };
          }
          setIsLoading(false);
        })
    }
  }
  const handleRedirect = () => {
    const path = encodeURIComponent(`${config.redirectUrl}?code=${getItem('section')}`);
    if (getItem('section') !== searchParams.get('code')) {
      setIsBtnLoading(true);
      window.location.href = `${config.baseUrl}/auth/login-facebook/web?state=${path}`;
    } else {
      alertSettings();
    }
  }

  const handleAddFanpage = () => {
    if (fanpages.length >= LIMIT_FANPAGES) {
      setIsOpenAlert(true);
      setAlert(
        translate(
          "fanpages.Bạn chỉ có thể kết nối tối đa 10 fanpages cho 1 tài khoản",
          "Bạn chỉ có thể kết nối tối đa 10 fanpages cho 1 tài khoản"
        )
      );
    } else {
      handleRedirect();
    }
  };

  const handleAddConnection = () => {
    setIsAddConnect(true);
  };

  const init = () => {
    navigate('/', { replace: false });
    setIsAddConnect(false);
    setIsLoading(true);
    apiGetChatGo24('/users/me/pages', (rs) => {
      if (rs && Array.isArray(rs.data) && rs.data.length > 0) {
        setIsConnect(true);
        setFanpages(rs.data);
      } else {
        getFaceBookPages();
      }
      setIsLoading(false);
    })
  }

  const handleLogout = async () => {
    await Go24Repository.logout(getItem('accessToken'));
    removeItem("accessToken");
    removeItem("accessTokenExpired");
    removeItem("shop-i");
    window.location.href = LOGIN_URL; // because recaptcha not refresh when navigate by router
  }

  return <Fragment>
    {
      isLoading ? <Loader /> :
        <Grid container justifyContent="center"
          alignItems="center" spacing={1} sx={{ height: "100%", background: `url(${fanpageBG}) center center`, m: 0 }}>
          <Grid item container md={12} justifyContent="center">
            <img src={LogoGO24} alt="LogoGO24" width="200" height="60" />
          </Grid>
          {isConnect === null ?
            <Grid item xs={7} md={6} lg={5} sx={{ color: "#0d3064", height: '70%' }}>
              <Text sx={{ fontWeight: 500, color: theme.textColor, mb: 4, textAlign: "center" }} variant="h4" gutterBottom><FormattedMessage
                id="fanpages.Kết nối Fanpage Facebook"
                defaultMessage="Kết nối Fanpage Facebook"
              /></Text>
              <Typography sx={{ mb: 2, color: theme.navColor }} variant="body2" >
                <FormattedMessage
                  id="fanpages.Kết nối hệ thống của Go24 và Fanpage Facebook, Bán và tạo đơn hàng trực tiếp trên Fanpage, quản lý tất cả các inbox, thông tin khách hàng."
                  defaultMessage="Kết nối hệ thống của Go24 và Fanpage Facebook, Bán và tạo đơn hàng trực tiếp trên Fanpage, quản lý tất cả các inbox, thông tin khách hàng."
                />
              </Typography>
              <Typography sx={{ mb: 4, color: theme.textColor }} variant="body2" >
                <FormattedMessage
                  id="fanpages.Vui lòng kết nối để bắt đầu sử dụng."
                  defaultMessage="Vui lòng kết nối để bắt đầu sử dụng."
                />
              </Typography>
              <LoadingButtonN
                onClick={handleAddConnection}
                loading={isBtnLoading}
                variant="outlined"
              >
                <FormattedMessage
                  id="fanpages.+ Thêm kết nối"
                  defaultMessage="+ Thêm kết nối"
                />
              </LoadingButtonN>
              <LoadingButtonN
                onClick={handleLogout}
                loading={isBtnLoading}
                variant="outlined"
                sx={{ ml: 2 }}
                style={{borderColor: '#eb6464'}}
              >
                <FormattedMessage
                  id="fanpages.Đăng xuất"
                  defaultMessage="Đăng xuất" />
              </LoadingButtonN>
            </Grid> :
            <Grid item xs={12} md={12} lg={10} sx={{ color: "#0d3064", height: '85%', width: '100%' }}>
              {isAddConnect === true ? <PlatformList isBtnLoading={isBtnLoading} addConnection={handleAddFanpage} onLogout={handleLogout} onBack={init}/> : isConnect === false ? <NotConneteds changeData={handleAddConnection} data={dataNotConnect} /> : <ConnectedList isBtnLoading={isBtnLoading} data={fanpages} changeData={handleAddConnection} removePage={init} onLogout={handleLogout}/>}
            </Grid>}
        </Grid>
    }
  </Fragment >
}

export default Fanpages