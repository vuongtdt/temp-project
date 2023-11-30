import React, { useEffect, useRef, useState } from 'react'
import { styled } from '@mui/material/styles';
import { Box, IconButton, InputBase, Stack, Typography } from '@mui/material';
import { useChatStore } from '../../store/chatStore';
import { FormattedMessage } from 'react-intl';
import SearchIcon from '@mui/icons-material/Search';
import translate from '../../translations'
import { apiGetChatGo24 } from '../../helper/apiHelper';
import { Page } from '../../utils/enum';
import { useConversationsStore } from '../../store/conversationsStore';
import { useParams } from 'react-router-dom';
import { parseObjectArrayToParam } from '../../helper/helper';
import { useSelectConversationStore } from '../../store/selectConversationStore';
import { useMessageStore } from '../../store/messagesStore';
import { ChatGo24Repository } from '../../repositories/ChatGo24Repository';

const FilterWrapper = styled(Box)(() => {
    const { theme } = useChatStore();
    return {
        color: theme.color,
        padding: '10px 5px',
        backgroundColor: theme.color1,
    }
})
export const TypographyN = styled(Typography)(() => {
    const { theme } = useChatStore();
    return {
        color: theme.color,
    }
})
const Search = styled(Box)(() => {
    const { theme } = useChatStore();
    return {
        position: 'relative',
        borderRadius: '8px',
        backgroundColor: theme.color1,
        padding: '5px 0',
        marginRight: '8px',
        marginLeft: '8px',
        width: 'calc(100% -16px)',
        border: `1px solid ${theme.borderColor}`,
    }
});
const BoxTitle = styled(Box)(() => {
    const { theme } = useChatStore();
    return {
        backgroundColor: theme.color1,
        width: '100%',
        padding: '10px 10px',
        fontSize: '1.2rem',
        fontWeight: '500',
        color: theme.color,
        textAlign: 'center',
    }
});
const SearchIconWrapper = styled(IconButton)(() => ({
    paddingLeft: '5px',
    height: '30px',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
}));

const StyledInputBase = styled(InputBase)(() => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: '0px',
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + 15px)`,
        width: '100%'
    },
    height: '30px',
    width: '100%',
    paddingRight: '5px',
}));
type Props = {}
const pageIndex = 1;
const Filter = (props: Props) => {
    const [value, setValue] = useState('');
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event?.target;
        setValue(value);
    };
    const { changeConversations, filter, changeFilter } = useConversationsStore();
    let { id } = useParams();
    const filterChat = useRef(null);
    filterChat.current = filter;
    const mounted = useRef(false);
    const { conversation, setConversation } = useSelectConversationStore();
    const { setMessages, setTotalMessage } = useMessageStore();
    let userId = conversation?.userId ? conversation?.userId : id;
    
    //rem temp
    // const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    // const open = Boolean(anchorEl);
    // const [isActive, setIsActive] = useState<boolean>(true);
    // useEffect(() => {
    //     handleGetInfo();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [])

    useEffect(() => {
        const params = parseObjectArrayToParam(filterChat.current);
        let url = filterChat.current?.userId?.length > 0 ? `/users/me/pages/conversations?pageIndex=${pageIndex}&pageSize=${Page.PageSize}&${params}` : `/users/me/pages/${userId}/conversations?pageIndex=${pageIndex}&pageSize=${Page.PageSize}&${params}`;
        apiGetChatGo24(url, res1 => {
            if (res1?.data) {
                changeConversations(res1?.data);
                if (res1?.data.length > 0) {
                    ChatGo24Repository.FetchConversation(userId, res1?.data[0].id);
                }
            }
            if (mounted.current === false) {
                mounted.current = true;
                changeConversations(res1?.data);
                if (res1?.data.length > 0) {
                    ChatGo24Repository.FetchConversation(userId, res1?.data[0].id);
                    setConversation(res1?.data[0]);
                    apiGetChatGo24(`/users/me/pages/${userId}/conversations/${res1?.data[0].id}/messages?pageIndex=${pageIndex}&pageSize=${Page.PageSize}&sortType=desc`, res2 => {
                        if (res2?.data && res2.data?.length > 0) {
                            // res2.data[0].isExpried ? setBlockChat(true) : setBlockChat(false);
                            setMessages(res2.data);
                            setTotalMessage(!!res2.data.length ? res2.data.length : 0);
                        }
                    })
                }
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter])

    // const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    //     setAnchorEl(event.currentTarget);
    // };
    // const handleClose = async (status?: number) => {
    //     const response = await ChatGo24Repository.UpdateStatus(userId, status);
    //     if (response) {
    //         handleGetInfo();
    //     }
    //     setAnchorEl(null);
    // };
    // const handleGetInfo = async () => {
    //     const res = await ChatGo24Repository.GetInfo(userId);
    //     if (res) {
    //         res.status === StatusUser.Active ? setIsActive(true) : setIsActive(false);
    //     }
    // }
    const handleSubmit = (e) => {
        e.preventDefault();
        changeFilter({ ...filter, searchText: e?.target[1]?.value });
    }
    const renderTitle = () => {
        let mes = '';
        switch (true) {
            case (filter.hasRead === false && filter.hasOrder === null && filter.hasReplied === null && filter.hasTags === null && (!filter.userId || filter?.userId?.length === 0)):
                mes = 'Hộp thoại chưa đọc';
                break;
            case (filter.hasRead === null && filter.hasOrder === null && filter.hasReplied === false && filter.hasTags === null && (!filter.userId || filter?.userId?.length === 0)):
                mes = 'Hộp thoại chưa trả lời';
                break;
            case (filter.hasRead === null && filter.hasOrder === true && filter.hasReplied === null && filter.hasTags === null && (!filter.userId || filter?.userId?.length === 0)):
                mes = 'Hộp thoại có đơn hàng';
                break;

            case (filter.hasRead === false && filter.hasOrder === null && filter.hasReplied === false && filter.hasTags === null && (!filter.userId || filter?.userId?.length === 0)):
                mes = 'Hộp thoại chưa đọc và chưa trả lời';
                break;

            case (filter.hasRead === false && filter.hasOrder === true && filter.hasReplied === null && filter.hasTags === null && (!filter.userId || filter?.userId?.length === 0)):
                mes = 'Hộp thoại chưa đọc và có đơn hàng';
                break;

            case (filter.hasRead === null && filter.hasOrder === true && filter.hasReplied === false && filter.hasTags === null && (!filter.userId || filter?.userId?.length === 0)):
                mes = 'Hộp thoại chưa trả lời và có đơn hàng';
                break;

            case (filter.hasRead === false && filter.hasOrder === true && filter.hasReplied === false && filter.hasTags === null && (!filter.userId || filter?.userId?.length === 0)):
                mes = 'Hộp thoại chưa trả lời, chưa trả lời và có đơn hàng';
                break;

            case (filter?.userId?.length > 0):
                mes = 'Gộp trang';
                break;


            default:
                mes = 'Tin nhắn';
                break;

        }
        return <FormattedMessage
            id={`${mes}`}
            defaultMessage={`${mes}`}
        />

    }
    return (
        <FilterWrapper>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <BoxTitle>{renderTitle()}</BoxTitle>
                {/* <Stack direction="row" alignItems="center">
                    <IconButton
                        id="fade-button"
                        aria-controls={open ? 'fade-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                    >
                        {isActive ? <><CheckCircleOutlinedIcon color="success" sx={{ fontSize: 20, marginRight: '5px' }} />
                            <TypographyN variant="subtitle1"><FormattedMessage
                                id="filter.Đang hoạt động"
                                defaultMessage="Đang hoạt động"
                            /></TypographyN></> :
                            <><DoNotDisturbOnTotalSilenceIcon color="error" sx={{ fontSize: 20, marginRight: '5px' }} />
                                <TypographyN variant="subtitle1" ><FormattedMessage
                                    id="filter.Ngưng hoạt động"
                                    defaultMessage="Ngưng hoạt động"
                                /></TypographyN></>}
                    </IconButton>
                    <Menu
                        id="fade-menu"
                        MenuListProps={{
                            'aria-labelledby': 'fade-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={() => handleClose()}
                        TransitionComponent={Fade}
                        sx={{
                            '.MuiMenu-paper.MuiPaper-elevation': {
                                backgroundColor: theme.navColor,
                            }
                        }}
                    >
                        <MenuItem onClick={() => handleClose(StatusUser.Active)}>
                            <CheckCircleOutlinedIcon color="success" sx={{ fontSize: 20, marginRight: '5px' }} />
                            <TypographyN variant="subtitle1" ><FormattedMessage
                                id="filter.Đang hoạt động"
                                defaultMessage="Đang hoạt động"
                            /></TypographyN>
                        </MenuItem>
                        <MenuItem onClick={() => handleClose(StatusUser.Deactive)}>
                            <DoNotDisturbOnTotalSilenceIcon color="error" sx={{ fontSize: 20, marginRight: '5px' }} />
                            <TypographyN variant="subtitle1" ><FormattedMessage
                                id="filter.Ngưng hoạt động"
                                defaultMessage="Ngưng hoạt động"
                            /></TypographyN>
                        </MenuItem>
                    </Menu>
                </Stack> */}
            </Stack>
            <Search component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                <SearchIconWrapper type="submit">
                    <SearchIcon />
                </SearchIconWrapper>
                <StyledInputBase
                    onChange={handleChange}
                    value={value}
                    placeholder={translate('filter.Tìm kiếm...', 'Tìm kiếm...')}
                    inputProps={{ 'aria-label': 'Search' }}
                />
            </Search>
        </FilterWrapper>
    )
}

export default Filter