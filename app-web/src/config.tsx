const config = {
    baseUrl: process.env.REACT_APP_BASE_URL ?? 'https://chat-api-stg.go24.vn',
    redirectUrl: process.env.REACT_APP_REDIRECT_URL ?? 'https://chat-stg.go24.vn',
    apiGo24Url: process.env.REACT_APP_API_GO24_Url ?? 'https://api-stg.go24.vn/api',
    baseGo24Url: process.env.REACT_APP_BASE_GO24_Url ?? 'https://api-stg.go24.vn',
    redirectLogin: process.env.REACT_APP_REDIRECT_LOGIN ?? 'https://chat-api-stg.go24.vn/auth/login-go24/web',
    recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY ?? '6Lc5uuQbAAAAALgMbRPLA-G9rW3l-CdIbjDeRvE8',
    shopGo24Url: process.env.SHOP_GO24_URL ?? 'https://shop-stg.go24.vn',
}

export default config;
