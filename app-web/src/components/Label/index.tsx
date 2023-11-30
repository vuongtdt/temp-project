import { Avatar, Box, Stack, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';
import LogoShort from 'Assets/Images/re-skin/Logo-short.png'
import LogoGo24 from 'Assets/Images/re-skin/Logo-go24.png'
import { StyledLinkPage } from '../../lib/component/Link';
import { useChatStore } from 'store/chatStore';
import { PageName } from 'utils/enum';
import { useLocalStorage } from 'lib/component/Hook/useLocalStorage';
import { ShopInfoModel } from 'models/fanpageModels';
import config from 'config';
import { stringAvatar } from 'helper/helper';

const LabelWrapper = styled(Stack)(() => {
    return {
        height: '100%',
    }
});

type Props = {
    name: string,
}
const Text = styled(Typography)(() => {
    const { theme } = useChatStore();
    return {
        color: theme.color2,
        margin: '0px',
    }
});
const Label = (props: Props) => {
    const { getItem } = useLocalStorage();
    const { theme } = useChatStore();
    const [shopInfo, setShopInfo] = useState<ShopInfoModel>();
    useEffect(() => {
        const _shopInfo = JSON.parse(getItem('shop-i'));
        _shopInfo && setShopInfo(_shopInfo);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <LabelWrapper direction="row" alignItems="center">
            {props.name === PageName.Messages && shopInfo ? <><Box sx={{
                borderRight: `1px solid ${theme.borderColor2}`,
                height: "100%",
                width: "calc(15% - 1px)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>
                <StyledLinkPage to="/">
                    <Avatar variant="square" alt="Logo" src={LogoShort} sx={{ width: 29, height: 24 }} />
                </StyledLinkPage>
            </Box>
                <Stack direction="row" alignItems="center" sx={{ margin: '0px auto' }}>
                    <Avatar sx={{ width: 40, height: 40, mr: 1 }}
                        src={`${config.baseGo24Url}${shopInfo?.imageUrl}`} ><Avatar {...stringAvatar(shopInfo?.fullName)} />
                    </Avatar>
                    <Tooltip key={shopInfo?.userId} title={shopInfo?.fullName || '--'} placement="bottom">
                        <Text className="text-truncate" sx={{ fontWeight: 400, color: theme.navColor, maxWidth: 170 }} variant="subtitle1" >
                            - {shopInfo?.userName}
                        </Text>
                    </Tooltip>
                </Stack>
            </> :
                <Box sx={{ margin: '0px auto' }}>
                    <Avatar variant="square" alt="Logo" src={LogoGo24} sx={{ width: 120, height: 40 }} />
                </Box>
            }
            {/* <TextP>
                <FormattedMessage
                    id={`main.Go24 - ${props.name} Fanpage`}
                    defaultMessage={`Go24 - ${props.name} Fanpage`}
                /></TextP> */}
        </LabelWrapper >
    )
}

export default Label