

// import Typography from '@mui/material/Typography';

// import { LoadingButton } from '@mui/lab';
// import { FormattedMessage } from 'react-intl';
import React, { useState } from 'react';
import { ItemModel } from '../../models/orderModel';
import translate from '../../translations';
import { Avatar, Box, InputAdornment, Modal } from '@mui/material';
import { apiGetGo24 } from '../../helper/apiHelper';
import { useChatStore } from '../../store/chatStore';
import MUIDataTable from "mui-datatables";
import { useRef } from 'react';
import PhotoIcon from '@mui/icons-material/Photo';
import config from 'config';
import Search from '@mui/icons-material/Search';
import { RHFTextField } from 'lib/component/hook-form';

type Props = {
    setItems: Function,
}


const ListItems = (props: Props) => {
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState<ItemModel[]>();
    const [itemsTable, setItemsTable] = useState<any[]>();
    const { theme } = useChatStore();
    const columns = useRef<any>();
    const options = useRef<any>();
    const handleRowClick = (rowData, rowMeta) => {
        if (rowData?.length > 0 && items?.length > 0) {
            let id = rowData[0];
            const item = items.find(item => item.id === id);
            if (item) props.setItems(item);
        }
    }
    options.current = {
        filterType: 'textField',
        rowsPerPage: 5,
        rowsPerPageOptions: [5, 10, 20],
        // tableBodyHeight: '100vh',
        tableBodyMaxHeight: '50vh',
        selectableRows: "multiple",
        selectableRowsHideCheckboxes: true,
        onRowClick: handleRowClick,
        download: false,
        print: false,
    }
    columns.current = [
        {
            name: "id",
            label: 'id',
            options: {
                filter: false,
                sort: true,
                display: false,
            }
        },
        {
            name: "image",
            label: translate('orders.Ảnh', 'Ảnh'),
            options: {
                customBodyRender: () => {
                    return (
                        <Avatar variant="rounded" src="xyz.PNG" >
                            <PhotoIcon />
                        </Avatar>
                    )
                }
            }
        },
        {
            name: "name",
            label: translate('orders.Tên', 'Tên'),
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "stock",
            label: translate('orders.Tồn', 'Tồn'),
            options: {
                filter: false,
                sort: true,
            }
        },
        {
            name: "price",
            label: translate('orders.Giá', 'Giá'),
            options: {
                filter: true,
                sort: true,
            }
        },
    ]
    const handleClose = () => setOpen(false);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setOpen(true)
        apiGetGo24('Item/gets-child-available', rs => {
            if (rs?.data && rs?.data?.data && rs?.data.result === 0) {
                setItems(rs?.data?.data);
                let itemsArray = [];
                rs.data.data.map(data => {
                    const item = [data.id, `${config.baseGo24Url}${data.imageUrl}`, data.name, data.quantity, data.retailPrice];
                    itemsArray.push(item);
                    return data;
                });
                setItemsTable(itemsArray);
            }
        })
    };

    return (
        <>
            {/* <LoadingButton size="small" onClick={handleClick} sx={{
                color: theme.noteColor,
                marginTop: 0,
            }}>
                <AddIcon sx={{ mr: '5px' }} />
                <Typography component='p' sx={{
                    fontSize: '12px',
                    whiteSpace: 'nowrap',
                }}>
                    <FormattedMessage
                        id="orders.Thêm sản phẩm *"
                        defaultMessage="Thêm sản phẩm *"
                    />
                </Typography>
            </LoadingButton> */}
            <RHFTextField
                name="add-new-product"
                placeholder={translate('orders.Thêm sản phẩm', 'Thêm sản phẩm')}
                onChangeParent={()=> {}}
                type='text'
                InputProps={{
                    startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                  }}
                >
            </RHFTextField>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box id="modal-modal-description" sx={{
                    position: "absolute",
                    left: '50%',
                    top: '50%',
                    width: '50%',
                    transform: 'translate(-50%, -50%)'
                }}>
                    <MUIDataTable
                        title={translate('listItem.Danh sách sản phẩm', 'Danh sách sản phẩm')}
                        data={itemsTable}
                        columns={columns.current}
                        options={options.current}
                    />
                </Box>

            </Modal>
        </>
    );
}
export default ListItems;