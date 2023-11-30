import React, { useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import Loader from '../../lib/component/Loader';
import { apiGetChatGo24 } from '../../helper/apiHelper';

type Props = {}

const Home = (props: Props) => {
  const [cookies, setCookie] = useCookies(["section", "accessToken"]);
  let navigate = useNavigate();
  useEffect(() => {
    let code = cookies.section;
    let accessToken = cookies.accessToken;
    if (!code) code = uuidv4();
    setCookie("section", code, {
      path: "/"
    });
    if (!accessToken) {
      apiGetChatGo24('/users/test-token',rs => {
        if (rs.data) {
          setCookie("accessToken", rs.data, {
            path: "/"
          });
        }
      })
    }
    navigate('/fanpages', { replace: true });
  }, [])

  return (
    <Loader></Loader>
  )
}

export default Home