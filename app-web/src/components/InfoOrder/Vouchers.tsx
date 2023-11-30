import React, { useEffect, useState } from 'react';
import translate from '../../translations';
import { Box, Modal } from '@mui/material';
import { apiGetGo24 } from '../../helper/apiHelper';
import { useChatStore } from '../../store/chatStore';
import MUIDataTable from "mui-datatables";
import { useRef } from 'react';
import { LoadingButtonN } from 'components/re-skin';
type Props = {
    setVoucher: Function,
    code: string,
}


const Vouchers = (props: Props) => {
    const [open, setOpen] = useState(false);
    const [vouchers, setVouchers] = useState<any[]>([]);
    const [vouchersTable, setVouchersTable] = useState<any[]>([]);
    const { theme } = useChatStore();
    const columns = useRef<any>();
    const options = useRef<any>();
    useEffect(() => {
        init();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    useEffect(() => {
        if (props.code && vouchers?.length > 0) {
            const _voucher = vouchers.find(voucher => voucher.code === props.code);
            if (_voucher) props.setVoucher(_voucher);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.code])
    const handleRowClick = (rowData, rowMeta) => {
        if (rowData?.length > 0 && vouchers?.length > 0) {
            let id = rowData[0];
            const voucher = vouchers.find(voucher => voucher.id === id);
            if (voucher) props.setVoucher(voucher);
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
            name: "code",
            label: translate('orders.Mã giảm giá', 'Mã giảm giá'),
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "name",
            label: translate('orders.Tên chương trình', 'Tên chương trình'),
            options: {
                filter: false,
                sort: true,
            }
        },
        {
            name: "value",
            label: translate('orders.Trị giá', 'Trị giá'),
            options: {
                filter: true,
                sort: true,
            }
        },
        {
            name: "message",
            label: translate('orders.Lưu ý', 'Lưu ý'),
            options: {
                filter: true,
                sort: true,
            }
        },
    ]
    const init = async () => {
        apiGetGo24('/Voucher/gets-available', rs => {
            if (rs?.data && rs?.data?.data && rs?.data.result === 0) {
                setVouchers(rs?.data?.data);
            }
        })
    }
    const handleClose = () => setOpen(false);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setOpen(true)
        if (vouchers?.length > 0) {
            let vouchersArray = [];
            vouchers.map(data => {
                const item = [data.id, data.code, data.name, data.value, data.message];
                vouchersArray.push(item);
                return data;
            });
            setVouchersTable(vouchersArray);
        }
        // apiGetGo24('/Voucher/gets-available', rs => {
        //     if (rs?.data && rs?.data?.data && rs?.data.result === 0) {
        //         setVouchers(rs?.data?.data);

        //     }
        // })
    };

    return (
        <>
            <LoadingButtonN onClick={handleClick} size="small" variant="contained" loading={false} sx={{
                backgroundColor: theme.noteColor, color: theme.bgColor,
                width: '35%',
                p: 0,
                border: 'none'
            }}>{translate('orders.Lấy mã', 'Lấy mã')}</LoadingButtonN>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="voucher-modal-title"
                aria-describedby="voucher-modal-description"
            >
                <Box id="voucher-modal-description" sx={{
                    position: "absolute",
                    left: '50%',
                    top: '50%',
                    width: '50%',
                    transform: 'translate(-50%, -50%)'
                }}>
                    <MUIDataTable
                        title={translate('listItem.Chọn mã giảm giá', 'Chọn mã giảm giá')}
                        data={vouchersTable}
                        columns={columns.current}
                        options={options.current}
                    />
                </Box>

            </Modal>
        </>
    );
}
export default Vouchers;