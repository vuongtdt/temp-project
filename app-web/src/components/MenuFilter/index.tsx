import React, { useState } from 'react'
import { styled } from '@mui/material/styles';
import { useChatStore } from '../../store/chatStore';
import { Avatar, Box, Checkbox, FormControlLabel, FormGroup, IconButton, Popover, Stack, Tooltip } from '@mui/material';
import { useConversationsStore } from '../../store/conversationsStore';
import { FilterConver } from 'utils/enum';
import CancelIcon from '@mui/icons-material/Cancel';
import translate from 'translations';
import { useFanpagesStore } from 'store/fanpagesStore';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import MessageIcon from 'Assets/Images/re-skin/MessageIcon.png';
import InboxIcon from 'Assets/Images/re-skin/InboxIcon.png';
import ReadIcon from 'Assets/Images/re-skin/ReadIcon.png';
import HasOrderIcon from 'Assets/Images/re-skin/HasOrderIcon.png';
import MultiAccountIcon from 'Assets/Images/re-skin/MultiAccountIcon.png';


const MenuWrapper = styled(Stack)(() => {
    const { theme } = useChatStore();
    return {
        height: '100%',
        borderRight: `1px solid ${theme.borderColor}`,
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
            right: '-10%',
            width: 0,
            height: 0,
            borderTop: `10px solid ${theme.textColor}`,
            borderRight: '10px solid transparent',
            content: "\"\"",
            transform: 'rotate(-45deg)',
        },
        '& svg': {
            color: theme.navColor,
        }
    }
});

type Props = {}


const MenuFilter = (props: Props) => {
    const { filter, changeFilter } = useConversationsStore();
    const [userIds, setUserIds] = useState<string[]>([]);
    const [isAll, setIsAll] = useState<boolean>(true);
    const { theme } = useChatStore();
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const openPop = Boolean(anchorEl);
    const id = openPop ? 'tags-popover' : undefined;
    const { fanpages } = useFanpagesStore();
    const handleChangeFilter = (key, value?) => {
        let _filter = { ...filter };
        if (key === FilterConver.All) {
            setIsAll(true);
            _filter = {
                hasRead: null,
                hasReplied: null,
                hasTags: null,
                hasOrder: null,
                searchText: '',
                userId: [],
            }
            changeFilter(_filter);
            return;
        }
        setIsAll(false);
        _filter = {
            ..._filter,
            [key]: value,
        }
        changeFilter(_filter);

    }
    const handleAddUserId = (event: React.ChangeEvent<HTMLInputElement>, userId: string) => {
        let _userIds = [...userIds];
        if (event.target.checked) {
            _userIds.push(userId);
        } else {
            _userIds = userIds?.filter(id => id !== userId);
        }
        setUserIds(_userIds);
    }
    const removeFilter = (key: string) => {
        let _filter = { ...filter };
        _filter = {
            ..._filter,
            [key]: null,
        }
        if (key === FilterConver.Together) setUserIds([]);
        if (_filter.hasRead === null && _filter.hasReplied === null && _filter.hasTags === null && _filter.hasOrder === null && _filter.searchText === '' && (_filter?.userId?.length === 0 || !_filter?.userId)) {
            setIsAll(true);
        }
        changeFilter(_filter);
    }
    return (
        <MenuWrapper direction="column" alignItems="center" justifyContent="space-between" >
            <Stack sx={{ width: '100%' }}>
                <MenuChild className={isAll && 'active'} >
                    <Tooltip title={translate("menuFilter.Tất cả tin hội thoại", "Tất cả tin hội thoại")} placement="right-start">
                        <IconButton onClick={() => handleChangeFilter(FilterConver.All, false)}>
                            <Avatar src={MessageIcon} variant="rounded" sx={{ width: 29, height: 24 }} />
                        </IconButton>
                    </Tooltip>
                </MenuChild>
                <MenuChild className={filter.hasRead === false && 'active'} >
                    <Tooltip title={translate("menuFilter.Lọc hội thoại chưa đọc", "Lọc hội thoại chưa đọc")} placement="right-start">
                        <Box sx={{
                            position: 'relative',
                        }}>
                            {filter.hasRead === false && <IconButton
                                onClick={() => removeFilter(FilterConver.HasRead)}
                                sx={{
                                    position: 'absolute',
                                    right: -10,
                                    top: -10,
                                    zIndex: 1
                                }}>
                                <CancelIcon sx={{ fontSize: 12 }}
                                />
                            </IconButton>}
                            <IconButton onClick={() => handleChangeFilter(FilterConver.HasRead, false)}>
                                <Avatar src={InboxIcon} variant="rounded" sx={{ width: 29, height: 24 }} />
                            </IconButton>
                        </Box>
                    </Tooltip>
                </MenuChild>
                <MenuChild className={filter.hasReplied === false && 'active'} >
                    <Tooltip title={translate("menuFilter.Lọc hội thoại chưa trả lời", "Lọc hội thoại chưa trả lời")} placement="right-start">
                        <Box sx={{
                            position: 'relative',
                        }}>
                            {filter.hasReplied === false && <IconButton
                                onClick={() => removeFilter(FilterConver.HasReplied)}
                                sx={{
                                    position: 'absolute',
                                    right: -10,
                                    top: -10,
                                    zIndex: 1
                                }}>
                                <CancelIcon sx={{ fontSize: 12 }}
                                />
                            </IconButton>}
                            <IconButton onClick={() => handleChangeFilter(FilterConver.HasReplied, false)}>
                                <Avatar src={ReadIcon} variant="rounded" sx={{ width: 29, height: 24 }} />
                            </IconButton>
                        </Box>
                    </Tooltip>
                </MenuChild>
                <MenuChild className={filter.hasOrder === true && 'active'} >
                    <Tooltip title={translate("menuFilter.Lọc hội thoại có đơn hàng", "Lọc hội thoại có đơn hàng")} placement="right-start">
                        <Box sx={{
                            position: 'relative',
                        }}>
                            {filter.hasOrder === true && <IconButton
                                onClick={() => removeFilter(FilterConver.HasOrder)}
                                sx={{
                                    position: 'absolute',
                                    right: -10,
                                    top: -10,
                                    zIndex: 1
                                }}>
                                <CancelIcon sx={{ fontSize: 12 }}
                                />
                            </IconButton>}
                            <IconButton onClick={() => handleChangeFilter(FilterConver.HasOrder, true)}>
                                <Avatar src={HasOrderIcon} variant="rounded" sx={{ width: 29, height: 24 }} />
                            </IconButton>
                        </Box>
                    </Tooltip>
                </MenuChild>
                <MenuChild className={filter.userId?.length > 0 && 'active'} >
                    <Tooltip title={translate("menuFilter.Gộp trang", "Gộp trang")} placement="right-start">
                        <Box sx={{
                            position: 'relative',
                        }}>
                            {filter.userId?.length > 0 && <IconButton
                                onClick={() => removeFilter(FilterConver.Together)}
                                sx={{
                                    position: 'absolute',
                                    right: -10,
                                    top: -10,
                                    zIndex: 1
                                }}>
                                <CancelIcon sx={{ fontSize: 12 }}
                                />
                            </IconButton>}
                            <IconButton onClick={(e) => setAnchorEl(e?.currentTarget)}>
                                <Avatar src={MultiAccountIcon} variant="rounded" sx={{ width: 29, height: 24 }} />
                            </IconButton>
                            <Popover
                                id={id}
                                open={openPop}
                                anchorEl={anchorEl}
                                onClose={() => setAnchorEl(null)}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                sx={{ width: '100%' }}
                            >
                                <Box sx={{ p: 1, bgcolor: theme.bgColor, color: theme.color }}>
                                    <FormGroup sx={{
                                        maxHeight: '300px',
                                        overflowY: 'scroll',
                                    }}>
                                        {fanpages?.map(fanpage =>
                                            <FormControlLabel key={fanpage?.userId} control={<Checkbox
                                                checked={userIds?.findIndex(id => id === fanpage.userId) > -1}
                                                onChange={(e) => handleAddUserId(e, fanpage.userId)}
                                                inputProps={{ 'aria-label': 'controlled' }}
                                            />} label={fanpage?.pageName} />

                                        )}
                                        <IconButton onClick={() => handleChangeFilter(FilterConver.Together, userIds)}>
                                            <CheckOutlinedIcon color='success' />
                                        </IconButton>
                                    </FormGroup>
                                </Box>
                            </Popover>
                        </Box>
                    </Tooltip>
                </MenuChild>

            </Stack >
        </MenuWrapper >
    )
}

export default MenuFilter
