import * as React from "react";
import {
  Grid,
  Typography,
  FormControl,
  Button,
  Paper,
  styled,
  Stack,
  FormControlLabel,
  Checkbox,
  Link,
  TextField,
} from "@mui/material";
import config from "config";
import { useChatStore } from "store/chatStore";
import LoginBg from "Assets/Images/bg-login.png";
import LoginBanner from "Assets/Images/login-banner.png";
import translate from "translations";
import FormProvider from "lib/component/hook-form/FormProvider";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Go24Repository } from "repositories/Go24Repository";
import {
  GoogleReCaptchaProvider,
  GoogleReCaptcha,
} from "react-google-recaptcha-v3";
import { ResultCode } from "models/apiResonseModel";
import { useLocalStorage } from "lib/component/Hook/useLocalStorage";
import moment from "moment";
import { useAlertStore } from "store/alertStore";
import AlertComponent from "components/Alert";
import { useNavigate } from "react-router-dom";

const LoginSchema = yup.object({
  username: yup.string().required("login.Tài khoản không được để trống"),
  password: yup.string().required("login.Mật khẩu không được để trống"),
  isRememberMe: yup.boolean(),
});

type LoginForm = {
  username: string;
  password: string;
  isRememberMe: boolean;
};

const Panel = styled(Paper)(() => {
  const { theme } = useChatStore();
  return {
    backgroundColor: theme.navColor,
    padding: "50px 50px 40px",
    borderRadius: "10px",
    width: "700px",
  };
});

const Wrapper = styled(Grid)(() => {
  const { theme } = useChatStore();
  return {
    backgroundColor: theme.bgColor,
    backgroundImage: "url(" + LoginBg + ")",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    minHeight: "100vh",
  };
});

const LoginBannerImage = styled("img")(() => ({
  width: "100%",
  height: "auto",
}));

const Title = styled(Typography)(() => {
  const { theme } = useChatStore();
  return {
    color: theme.color,
    textAlign: "center",
    marginBottom: "2rem",
  };
});

const LoginButton = styled(Button)(() => ({
  background: "#ffd36b",
  color: "#000000",
  fontWeight: "400",
  textTransform: "none",
  boxShadow: "none",
  "&:hover, &.active": {
    background: "#ffd36b",
    color: "#000000",
  },
}));

const Login = () => {
  const navigate = useNavigate();
  const methods = useForm<LoginForm>({
    resolver: yupResolver(LoginSchema),
    mode: "onChange",
    defaultValues: {
      isRememberMe: false,
    },
  });
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods;
  const { setItem } = useLocalStorage();
  const {
    setAlert,
    setType,
    setIsOpenAlert,
    isOpenAlert,
    alertText,
    type,
    horizontal,
    vertical,
  } = useAlertStore();

  const [reCaptchaToken, setReCaptchaToken] = React.useState("");
  const [refreshReCaptcha, setRefreshReCaptcha] = React.useState(false);

  const onVerify = React.useCallback((token) => {
    setReCaptchaToken(token);
  }, []);
  const onSubmit = async () => {
    const data = await Go24Repository.login(
      methods.getValues("username"),
      methods.getValues("password"),
      methods.getValues("isRememberMe"),
      reCaptchaToken
    );
    if (data.result === ResultCode.Success && data.data.roles.length) {
      setItem("accessToken", data.data.accessToken);
      setItem("accessTokenExpired", moment().add(1, "hours").toString());
      setItem("shop-i", JSON.stringify(data.data));
      navigate('/');
    }
    if (data.result === ResultCode.Success && !data.data.roles.length) {
      setAlert(
        translate(
          "login.Tài khoản không có quyền truy cập",
          "Tài khoản không có quyền truy cập"
        )
      );
      setType("error");
      setIsOpenAlert(true);
      setRefreshReCaptcha(r => !r);
    }
    if (data.result !== ResultCode.Success) {
      setAlert(data.friendlyMessage);
      setType("error");
      setIsOpenAlert(true);
      setRefreshReCaptcha(r => !r);
    }
  };

  return (
    <Wrapper container justifyContent="center" alignItems="center">
      <Panel>
        <Title variant="h5">
          {translate("login.Đăng nhập Chat - Go24", "Đăng nhập Chat - Go24")}
        </Title>
        <Grid container>
          <Grid xs={6}>
            <LoginBannerImage src={LoginBanner} alt="Go24" />
          </Grid>
          <Grid xs={6}>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={2} direction="column">
                <FormControl variant="standard" fullWidth>
                  <TextField
                    label={translate("login.Tài khoản", "Tài khoản")}
                    id="username"
                    size="small"
                    fullWidth
                    error={!!errors.username}
                    helperText={
                      !!errors.username
                        ? translate(
                            errors.username?.message,
                            "Tài khoản không được để trống"
                          )
                        : ""
                    }
                    {...register("username")}
                  />
                </FormControl>
                <FormControl variant="standard" fullWidth>
                  <TextField
                    label={translate("login.Mật khẩu", "Mật khẩu")}
                    id="password"
                    size="small"
                    type="password"
                    fullWidth
                    error={!!errors.password}
                    helperText={
                      !!errors.password
                        ? translate(
                            errors.password?.message,
                            "Mật khẩu không được để trống"
                          )
                        : ""
                    }
                    {...register("password")}
                  />
                </FormControl>
                <Grid container alignItems="center">
                  <Grid xs={6}>
                    <FormControlLabel
                      control={<Checkbox />}
                      label={translate("login.Nhớ mật khẩu", "Nhớ mật khẩu")}
                      {...register("isRememberMe")}
                    />
                  </Grid>
                  <Grid xs={6}>
                    <Link href={`${config.shopGo24Url}/authen/reset-password`}>
                      {translate("login.Quên mật khẩu", "Quên mật khẩu")}
                    </Link>
                  </Grid>
                </Grid>
                <FormControl>
                  <LoginButton variant="contained" type="submit">
                    {translate("login.Đăng nhập", "Đăng nhập")}
                  </LoginButton>
                </FormControl>
                <Typography variant="inherit">
                  {translate(
                    "login.Bạn chưa có tài khoản",
                    "Bạn chưa có tài khoản"
                  )}
                  ?
                  <Link href={`${config.shopGo24Url}/authen/register`}>
                    {translate("login.Đăng ký ngay", "Đăng ký ngay")}
                  </Link>
                </Typography>
                <GoogleReCaptchaProvider reCaptchaKey={config.recaptchaSiteKey}>
                  <GoogleReCaptcha 
                    onVerify={onVerify} 
                    refreshReCaptcha={refreshReCaptcha}
                  />
                </GoogleReCaptchaProvider>
              </Stack>
            </FormProvider>
          </Grid>
        </Grid>
      </Panel>
      <AlertComponent
        open={isOpenAlert}
        onClose={() => setIsOpenAlert(false)}
        text={alertText}
        type={type}
        horizontal={horizontal}
        vertical={vertical}
      />
    </Wrapper>
  );
};

export default Login;
