import { Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack } from "@mui/material";
import { FormattedMessage } from "react-intl"
import { useChatStore } from "store/chatStore";
import { useTranslateStore } from "store/translateStore";
import { DarkTheme } from 'themes/DarkTheme';
import { LightTheme } from 'themes/LightTheme';
import { useEffect, useState } from "react";
import TranslateIcon from '@mui/icons-material/Translate';
import messages_en from "translations/locales/en.json";
import messages_vi from "translations/locales/vi.json";
import { useLocalStorage } from "lib/component/Hook/useLocalStorage";
import { Text } from 'components/re-skin';

type Props = {}

const General = (props: Props) => {
    const { theme, changeTheme } = useChatStore();
    const { setItem, getItem } = useLocalStorage();
    const [state, setState] = useState<{ theme: string, locale: string }>({
        theme: getItem('theme') || 'LightTheme',
        locale: getItem('locale') || 'vi'
    });
    const { translate } = useTranslateStore();
    useEffect(() => {
        getItem('theme') === 'DarkTheme' ? changeTheme(DarkTheme) : changeTheme(LightTheme);
        getItem('locale') === 'vi' ? translate(messages_vi, 'vi') : translate(messages_en, 'en');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // const handleChangeTheme = (e) => {
    //     e.target.value === 'LightTheme' ? changeTheme(LightTheme) : changeTheme(DarkTheme);
    //     setItem('theme', e.target.value);
    //     setState({ ...state, theme: e.target.value });
    // }
    const handleChangeLanguages = (e) => {
        e.target.value === 'vi' ? translate(messages_vi, 'vi') : translate(messages_en, 'en');
        setItem('locale', e.target.value);
        setState({ ...state, locale: e.target.value });
    }
    return (
        <Box>
            <Text sx={{ fontWeight: 500, color: theme.noteColor, pb: 1, borderBottom: `1px solid ${theme.borderColor}`, }} variant="h6" gutterBottom><FormattedMessage
                id="orders.Cài đặt chung"
                defaultMessage="Cài đặt chung"
            /></Text>
            <Stack>
                <Stack>
                    {/* <FormControl>
                        <FormLabel id="demo-controlled-radio-buttons-group1">
                            <Stack sx={{ mt: 2 }} direction="row" alignItems="center">
                                <Brightness4OutlinedIcon sx={{ mr: 1 }} />
                                <Text><FormattedMessage
                                    id="general.Chế độ tối"
                                    defaultMessage="Chế độ tối"
                                /></Text>
                            </Stack>
                            <Text variant="caption" sx={{ ml: 4 }}><FormattedMessage
                                id="general.Điều chỉnh giao diện của Chat Go24 để giảm độ chói và cho đôi mắt được nghỉ ngơi."
                                defaultMessage="Điều chỉnh giao diện của Chat Go24 để giảm độ chói và cho đôi mắt được nghỉ ngơi."
                            /></Text>
                        </FormLabel>
                        <RadioGroup
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            value={state?.theme}
                            onChange={handleChangeTheme}
                            sx={{
                                marginLeft: '130px',
                                '& span': {
                                    fontSize: '0.8rem'
                                },
                                '& .css-vqmohf-MuiButtonBase-root-MuiRadio-root': {
                                    padding: '5px',
                                    marginRight: '20px'
                                }
                            }}
                        >
                            <FormControlLabel value={'LightTheme'} control={<Radio />} label={t('general.Tắt','Tắt')} />
                            <FormControlLabel value={'DarkTheme'} control={<Radio />} label={t('general.Bật','Bật')}  />
                        </RadioGroup>
                    </FormControl> */}
                    <FormControl>
                        <FormLabel id="demo-controlled-radio-buttons-group2">
                            <Stack sx={{ mt: 2 }} direction="row" alignItems="center">
                                <TranslateIcon sx={{ mr: 1, color: theme.mainColor }} />
                                <Text><FormattedMessage
                                    id="general.Chế độ ngôn ngữ"
                                    defaultMessage="Chế độ ngôn ngữ"
                                /></Text>
                            </Stack>
                            <Text variant="caption" sx={{ ml: 4 }}><FormattedMessage
                                id="Điều chỉnh ngôn ngữ phù hợp."
                                defaultMessage="Điều chỉnh ngôn ngữ phù hợp."
                            /></Text>
                        </FormLabel>
                        <RadioGroup
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            value={state?.locale}
                            onChange={handleChangeLanguages}
                            sx={{
                                marginLeft: '130px',
                                '& span': {
                                    fontSize: '0.8rem'
                                },
                                '& .css-vqmohf-MuiButtonBase-root-MuiRadio-root': {
                                    padding: '5px',
                                    marginRight: '20px'
                                },
                            }}
                        >
                            <FormControlLabel sx={{
                                'svg': {
                                    color: theme.noteColor
                                }
                            }} value={'vi'} control={<Radio />} label="Tiếng Việt" />
                            <FormControlLabel sx={{
                                'svg': {
                                    color: theme.noteColor
                                }
                            }} value={'en'} control={<Radio />} label="English" />
                        </RadioGroup>
                    </FormControl>
                </Stack>
            </Stack>
        </Box>
    )
}

export default General