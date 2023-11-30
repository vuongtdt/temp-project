import * as Yup from 'yup';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Stack, IconButton, MenuItem, Typography, styled, Box, List, ListItem, ListItemButton, ListItemText, ListItemIcon, Avatar, TextField, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { FormProvider, RHFTextField, NumberFormatCustom } from '../../lib/component/hook-form';
import translate from '../../translations';
import { useChatStore } from '../../store/chatStore';
import { FormattedMessage } from 'react-intl';
import { ItemModel } from '../../models/orderModel';
import ListItems from './ListItems';
import DeleteIcon from '@mui/icons-material/Delete';
import { debounce, formatNumber, phoneRegExp, weightRegExp } from '../../helper/helper';
import config from '../../config';
import { useAlertStore } from '../../store/alertStore';
import { apiGetGo24, apiPatchChatGo24, apiPostGo24 } from '../../helper/apiHelper';
import PhotoIcon from '@mui/icons-material/Photo';
import { TabInfo } from 'utils/enum';
import { useTabStore } from '../../store/changeTabStore';
import { useSelectConversationStore } from '../../store/selectConversationStore';
import { apiGo24 } from 'api';
import Loader from 'lib/component/Loader';
import Vouchers from './Vouchers';
import RHFSelect from 'lib/component/hook-form/RHFSelect';
import { Go24Repository } from 'repositories/Go24Repository';
import { useSelectOrder } from 'store/selectOrder';
import { ChatGo24Repository } from 'repositories/ChatGo24Repository';
import { useInfoSelectStore } from 'store/infoSelectStore';
import { LoadingButtonN } from 'components/re-skin';
const Text = styled(Typography)(() => {
  const { theme } = useChatStore();
  return {
    color: theme.color2,
    margin: '0px',
  }
});
const OrderWrapper = styled(Box)(() => {
  return {
    maxHeight: '65.5vh',
    overflowY: 'scroll',
    '@media (max-width:1700px)': {
      maxHeight: '64.5vh',
    },
    '@media (max-width:1300px)': {
      maxHeight: '62vh',
    },
    '@media (max-width:1100px)': {
      maxHeight: '55vh',
    },
  }
});
export const TextFieldN = styled(TextField)(() => {
  const { theme } = useChatStore();
  return {
    '.MuiSelect-select': {
      color: theme.color,
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      maxWidth: '20vw',
      overflow: 'hidden',
    },
    '.MuiOutlinedInput-input.MuiInputBase-inputSizeSmall': {
      padding: '8px 8px',
      // fontSize:'13px',
    },
    'label, label.Mui-disabled': {
      color: 'grey',
      fontSize: '14px',
      top: '1px',
    },
    'input': {
      color: theme.color,
    },
    'fieldset': {
      color: theme.color,
      borderColor: 'inherit',
      fontSize: '14px',
    },
    '.MuiOutlinedInput-root.MuiInputBase-colorPrimary': {
      color: theme.color,
    },
    '& label.Mui-focused': {
      color: theme.noteColor,
      fontSize: '14px',
      top: '2px',
    },
    '& label.MuiFormLabel-filled': {
      top: '2px',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: theme.noteColor,
    },
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused fieldset': {
        borderColor: theme.noteColor,
      },
      '&:hover fieldset': {
        borderColor: theme.noteColor,
      },
    },
    '@media (max-width:1700px)': {
      'fieldset': {
        fontSize: '10px',
      },
    },
  }
});

export default function LoginForm() {
  const { order } = useSelectOrder();
  const { id } = useParams();
  const [totalOld, setTotalOld] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [isCustomerPaid, setIsCustomerPaid] = useState(false);
  const [partnerDeliveryId, setPartnerDeliveryId] = useState<number>();
  const { conversation, setConversation } = useSelectConversationStore();
  const { theme } = useChatStore();
  const [shopLocations, setShopLocations] = useState<any>([]);
  const [shopLocation, setShopLocation] = useState<any>();
  const [infoSelect, setInfoSelect] = useState<any>();
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [province, setProvince] = useState<any>();
  const [district, setDistrict] = useState<any>();
  const [ward, setWard] = useState<any>();
  const [address4, setAddress4] = useState<any>();
  const [weight, setWeight] = useState<any>('');
  const [collectingMoney, setCollectingMoney] = useState<number>();
  const [provinces, setProvinces] = useState<any[]>([]);
  const [partnerDelivery, setPartnerDelivery] = useState<any>([]);
  const [delivery, setDelivery] = useState<any>();
  const [infoSelects, setInfoSelects] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any>([]);
  const [wards, setWards] = useState<any>([]);
  const [address4s, setAddress4s] = useState<any>([]);
  const [typeDefault, setTypeDefault] = useState<number>(0);
  const [typeShowItemDefault, setTypeShowItemDefault] = useState<number>(2);
  const [selectItems, setSelectItems] = useState<ItemModel[]>([]);
  const [voucher, setVoucher] = useState<any>(null);
  const [state, setState] = useState<any>({
    length: '',
    width: '',
    height: '',
    shopCode: '',
    insurranceFee: '',
    note: '',
  });
  const { setIsOpenAlert, setAlert, setType, setHorizontal } = useAlertStore();
  const { isEdit, changeTab } = useTabStore();
  const isCheckEdit = useRef<boolean>(isEdit);
  const inputRef = useRef<any>();
  const { infoSelect: infoSelectStore, setInfoSelect: setInfoSelectStore } = useInfoSelectStore();
  let userId = conversation?.userId ? conversation?.userId : id;

  const types = useRef<any[]>([
    {
      value: 0,
      name: translate('orders.Tiêu chuẩn', 'Tiêu chuẩn')
    },
    {
      value: 1,
      name: translate('orders.Dễ vỡ', 'Dễ vỡ')
    },
    {
      value: 2,
      name: translate('orders.Giao hàng 1 phần', 'Giao hàng 1 phần')
    },
    {
      value: 7,
      name: translate('orders.Nông sản/thực phẩm khô', 'Nông sản/thực phẩm khô')
    }
  ]);
  const typeShowItem = useRef<any[]>([
    {
      value: 1,
      name: translate('orders.Không cho xem hàng', 'Không cho xem hàng')
    },
    {
      value: 2,
      name: translate('orders.Cho xem hàng không thử', 'Cho xem hàng không thử')
    },
    {
      value: 3,
      name: translate('orders.Cho thử hàng', 'Cho thử hàng')
    }
  ]);
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    init();
    return () => {
      mounted.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (isEdit && order && infoSelects?.length > 0) {
      setPhoneNumber(order.phoneNumber);
      let _infoSelect = infoSelects.find(i => i.phoneNumber?.replace(/\s/g, '') === order.phoneNumber);
      _infoSelect = {
        address: order.address,
        phoneNumber: order.phoneNumber,
        provinceId: order.provinceId,
        districtId: order.districtId,
        wardId: order.wardId,
        addressLevel4Id: order.addressLevel4Id,
        fullName: order.fullName
      }
      // _infoSelect = { ..._infoSelect, addressLevel4Id: order.addressLevel4Id, , };
      setInfoSelect(_infoSelect);
      setWeight(order.weight);
      setCollectingMoney(order.collectMoney);
      setTypeDefault(order.type);
      setTypeShowItemDefault(order.typeShowItem);
      setState({
        length: order.length,
        width: order.width,
        height: order.height,
        shopCode: order.shopCode,
        insurranceFee: order.insurranceFee,
        note: order.note
      })
      setVoucher({ ...voucher, code: order.voucherCode });
      setPartnerDeliveryId(order.partnerDeliveryId);
      setSelectItems(order.items);
    } else if (infoSelectStore) {
      setPhoneNumber(infoSelectStore.phoneNumber);
      let _infoSelect = {
        ...infoSelect,
        address: infoSelectStore.addressDetail,
        phoneNumber: infoSelectStore.phoneNumber,
        fullName: infoSelectStore.fullName
      }
      setInfoSelect(_infoSelect);
      detachAddress(infoSelectStore.addressDetail, _infoSelect);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, infoSelects, infoSelectStore])
  useEffect(() => {
    let delay: any;
    if (shopLocation && province && district && weight && collectingMoney) {
      setIsLoading(true);
      delay = setTimeout(() => {
        let url = `/DeliveryPartner/get-price-delivery?fromProvinceId=${shopLocation?.provinceId}&fromDistrictId=${shopLocation?.districtId}&toProvinceId=${province.id}&toDistrictId=${district.id}&weight=${weight}&isCustomerPaid=${isCustomerPaid}&collectingMoney=${collectingMoney}`;
        apiGetGo24(url, res => {
          if (res.data?.data && res.data?.result === 0) {
            setPartnerDelivery(res.data?.data);
          }
          setIsLoading(false);
        })
      }, 3000);
    }
    return () => clearTimeout(delay);
  }, [shopLocation, province, district, weight, collectingMoney, isCustomerPaid])
  useEffect(() => {
    if (shopLocations?.length > 0 && order && isEdit) {
      let _shopLocation = shopLocations.find(s => s.id === order.shopLocationId)
      setShopLocation(_shopLocation);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shopLocations])
  useEffect(() => {
    const deliveryClone = partnerDelivery?.find(p => p.id === delivery?.id);
    if (deliveryClone) {
      setDelivery(deliveryClone);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partnerDelivery])
  useEffect(() => {
    if (infoSelect)
      autofill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [infoSelect])
  useEffect(() => {
    if (districts?.length > 0 && infoSelect) {
      let district = districts?.find(d => d.id === infoSelect.districtId);
      district && handleChangeDistrict(district);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [districts])
  useEffect(() => {
    if (wards?.length > 0 && infoSelect) {
      let ward = wards?.find(d => d.id === infoSelect.wardId);
      ward && handleChangeWard(ward);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wards])
  useEffect(() => {
    if (address4s?.length > 0 && infoSelect) {
      let address4 = address4s?.find(d => d.id === infoSelect.addressLevel4Id);
      address4 && setAddress4(address4);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address4s, infoSelect])
  const autofill = () => {
    if (!infoSelect) return;
    if (infoSelect.isDetach !== true) {
      setFullName(infoSelect.fullName);
      setAddress(infoSelect.address);
    } else if (infoSelect.isDetach) {
      if (!infoSelect.address || !infoSelect.provinceId) {
        setProvince({});
        setDistrict({});
        setWard({});
      } else if (!infoSelect.districtId) {
        setDistrict({});
        setWard({});
      } else if (!infoSelect.wardId) {
        setWard({});
      }
    }
    if (provinces?.length > 0 && infoSelect?.provinceId) {
      let province = provinces.find(p => p.id === infoSelect.provinceId);
      province && handleChangeProvince(province);
    }
  }

  const LoginSchema = Yup.object().shape({
    // address: Yup.string().required(translate('orders.Địa chỉ không được bỏ trống', 'Địa chỉ không được bỏ trống')),
    // provinceId: Yup.string().required(translate('orders.Tỉnh Thành không được bỏ trống', 'Tỉnh Thành không được bỏ trống')),
    // districtId: Yup.string().required(translate('orders.Quận Huyện không được bỏ trống', 'Quận Huyện không được bỏ trống')),
    // wardId: Yup.string().required(translate('orders.Phường Xã không được bỏ trống', 'Phường Xã không được bỏ trống')),
    // phoneNumber: Yup.string().matches(phoneRegExp, translate('orders.Sai định dạng số điện thoại', 'Sai định dạng số điện thoại')),
    // weight: Yup.string().matches(weightRegExp, translate('orders.Khối lượng phải là số', 'Khối lượng phải là số')).required(translate('orders.Khối lượng không được bỏ trống', 'Khối lượng không được bỏ trống')),
  });
  const defaultValues = {
    shopLocationId: '',
    address: '',
    phoneNumber: '',
    provinceId: '',
    districtId: '',
    wardId: '',
    items: []
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });
  const calculate = (selectItems) => {
    if (!mounted.current) return;
    if (Array.isArray(selectItems) && selectItems.length > 0) {
      const total = selectItems.map(s => s.retailPrice * s.quantity).reduce((acc, item) => acc + item);
      setCollectingMoney(prev => {
        if (!prev) prev = 0;
        return prev + total - totalOld
      });
      setTotalOld(total);
    } else {
      setTotalOld(0);
      setCollectingMoney(0);
    }
  }
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;
  const validate = (): boolean => {
    let isShow = false;
    if (!phoneNumber || phoneNumber.search(phoneRegExp) < 0) {
      setAlert(translate('orders.Sai định dạng số điện thoại', 'Sai định dạng số điện thoại'));
      isShow = true;
    } else if (!province?.id) {
      setAlert(translate('orders.Tỉnh Thành không được bỏ trống', 'Tỉnh Thành không được bỏ trống'));
      isShow = true;
    } else if (!district?.id) {
      setAlert(translate('orders.Quận Huyện không được bỏ trống', 'Quận Huyện không được bỏ trống'));
      isShow = true;
    } else if (!ward?.id) {
      setAlert(translate('orders.Phường Xã không được bỏ trống', 'Phường Xã không được bỏ trống'));
      isShow = true;
    } else if (!weight) {
      setAlert(translate('orders.Khối lượng không được bỏ trống', 'Khối lượng không được bỏ trống'));
      isShow = true;
    } else if (weight?.toString().search(weightRegExp) < 0) {
      setAlert(translate('orders.Khối lượng phải là số', 'Khối lượng phải là số'));
      isShow = true;
    } else if (!selectItems || selectItems?.length === 0) {
      setAlert(translate('orders.Chưa chọn sản phẩm', 'Chưa chọn sản phẩm'));
      isShow = true;
    } else if (!partnerDeliveryId) {
      setAlert(translate('orders.Chưa chọn đơn vị vận chuyển', 'Chưa chọn đơn vị vận chuyển'));
      isShow = true;
    }
    if (isShow) {
      setType('error');
      setHorizontal('right');
      setIsOpenAlert(true);
    }
    return isShow;
  }
  const onSubmit = async (e) => {
    if (validate()) return;
    if (Array.isArray(selectItems) && selectItems?.length > 0 && partnerDeliveryId) {
      const _order = !isCheckEdit.current ? {
        input: {
          ...e,
          items: [...selectItems],
          collectMoney: collectingMoney ? collectingMoney : delivery?.shopPay,
          deliveryAmount: delivery?.deliveryPrice,
          insurranceAmount: delivery?.insurranceAmount,
          insurranceFee: state.insurranceFee ? parseFloat(state.insurranceFee) : delivery?.insurranceFee,
          isCustomerPaid,
          isDeliveryOwner: true,
          partnerDeliveryId,
          voucherCode: voucher?.code,
          shopLocationId: shopLocation?.id,
          type: typeDefault,
          typeShowItem: e.typeShowItem ? e.typeShowItem : typeShowItemDefault,
          phoneNumber,
          fullName,
          address,
          provinceId: province?.id,
          districtId: district?.id,
          wardId: ward?.id,
          addressLevel4Id: address4?.id,
          weight,
        }
      } : {
        orderUpdate: {
          ...order,
          items: [...selectItems],
          collectMoney: collectingMoney ? collectingMoney : delivery?.shopPay,
          deliveryAmount: delivery?.deliveryPrice,
          insurranceAmount: delivery?.insurranceAmount,
          insurranceFee: state.insurranceFee ? parseFloat(state.insurranceFee) : delivery?.insurranceFee,
          isCustomerPaid,
          isDeliveryOwner: true,
          partnerDeliveryId,
          voucherCode: voucher?.code,
          shopLocationId: shopLocation?.id,
          type: typeDefault,
          typeShowItem: e.typeShowItem ? e.typeShowItem : typeShowItemDefault,
          phoneNumber,
          fullName,
          address,
          provinceId: province?.id,
          districtId: district?.id,
          wardId: ward?.id,
          addressLevel4Id: address4?.id,
          weight,
          length: state.length,
          width: state.width,
          height: state.height,
          note: state.note,
        }
      };
      if (isCheckEdit.current) {
        apiPostGo24('/order/update-info', _order, (rs) => {
          if (rs.data && rs.data.code === 'Success' && rs.data.result === 0) {
            let _conversation = { ...conversation };
            apiPatchChatGo24(`/users/me/pages/${userId}/conversations/${conversation.id}`, { go24OrderId: order?.id, sentTo: _conversation.sentTo }, (rs2) => {
            })
            setAlert(translate('oders.Đơn hàng đã được cập nhật thành công', 'Đơn hàng đã được cập nhật thành công'));
            setType('success');
            setHorizontal('right');
            setIsOpenAlert(true);
            changeTab(TabInfo.Orders);
          } else if (rs.data && rs.data.code === 'Fail' && rs.data.errorMessage) {
            setAlert(translate(rs.data.errorMessage, rs.data.errorMessage));
            setType('error');
            setHorizontal('right');
            setIsOpenAlert(true);
          }
        })
      } else {
        apiPostGo24('/order/add', _order, async (rs) => {
          if (rs.data && rs.data.code === 'Success' && rs.data.result === 0 && rs.data.data) {
            let _conversation = { ...conversation };
            if (!_conversation.sentTo.userName) _conversation.sentTo.userName = fullName;
            if (!_conversation.sentTo.phoneNumber) _conversation.sentTo.phoneNumber = phoneNumber;
            if (!_conversation.sentTo.address) _conversation.sentTo.address = address;
            apiPatchChatGo24(`/users/me/pages/${userId}/conversations/${conversation.id}`, { go24OrderId: rs.data.data, sentTo: _conversation.sentTo }, (rs2) => {
            })
            if (isConfirm) {
              apiPostGo24('/order/confirm', {
                orderId: rs.data.data
              }, (rs3) => {
                setIsConfirm(false);
                if (rs3.data?.code === 'Fail' && rs3.data?.data) {
                  setAlert(translate('rs3.data?.data', 'Xác nhận thất bại'));
                  setType('error');
                  setHorizontal('right');
                  setIsOpenAlert(true);
                }
              })
            }
            if (conversation?.userAddresses?.findIndex(ad => ad.addressDetail === address) < 0) {
              let _address = {
                fullName: fullName,
                phoneNumber: phoneNumber,
                addressDetail: address,
                isDefault: false,
              }
              let response = await ChatGo24Repository.AddAddress(conversation.id, userId, _address)
              if (response === true) {
                _conversation?.userAddresses?.push(_address)
              }
            }
            _conversation.go24OrderIds.push(rs.data.data.toString());
            setConversation(_conversation);
            setAlert(translate('oders.Đơn hàng đã được tạo thành công', 'Đơn hàng đã được tạo thành công'));
            setType('success');
            setHorizontal('right');
            setIsOpenAlert(true);
            changeTab(TabInfo.Orders);
          } else if (rs.data && rs.data.code === 'Fail' && rs.data.errorMessage) {
            setAlert(translate(rs.data.errorMessage, rs.data.errorMessage));
            setType('error');
            setHorizontal('right');
            setIsOpenAlert(true);
          }
        })
      }
    }
    // else if (partnerDeliveryId) {
    //   setAlert(translate('orders.Chưa chọn sản phẩm', 'Chưa chọn sản phẩm'));
    //   setType('error');
    //   setHorizontal('right');
    //   setIsOpenAlert(true);
    // } else {
    //   setAlert(translate('orders.Chưa chọn đơn vị vận chuyển', 'Chưa chọn đơn vị vận chuyển'));
    //   setType('error');
    //   setHorizontal('right');
    //   setIsOpenAlert(true);
    // }

  };
  const init = async () => {
    setIsCustomerPaid(false);
    apiGetGo24('/shopLocation/gets-available', res => {
      if (res.data?.data && res.data?.result === 0) {
        setShopLocations(res.data?.data)
        if (res.data?.data?.length > 0) {
          let _shopLocation = res.data?.data.find(data => data.isDefault);
          setShopLocation(_shopLocation);
        }
      }
    });
    apiGetGo24('/province/gets', res => {
      if (res.data?.data && res.data?.result === 0) {
        setProvinces(res.data?.data)
      }
    });
    apiGetGo24('/me/get', res => {
      if (res.data?.data && res.data?.result === 0) {
        if (!isEdit) {
          setTypeDefault(0);
          setTypeShowItemDefault(res.data?.data?.typeShowItem);
        }
      }
    });
    let response = await Go24Repository.GetsPhoneNumber();
    if (response && response.code === 'Success' && response.data) {
      setInfoSelects(response.data);
    }
  }
  const handleChangeProvince = (value: any, isAutoFill?: boolean) => {
    if (isAutoFill) return;
    setDistrict({});
    setWard({});
    setProvince(value);
    apiGetGo24(`/district/gets-by-province?provinceId=${value?.id}`, res => {
      if (res.data?.data && res.data?.result === 0) {
        setDistricts(res.data?.data)
      }
    })
  }
  const handleChangeDistrict = (value: any) => {
    setWard({});
    setDistrict(value);
    apiGetGo24(`/ward/gets-by-district?districtId=${value?.id}`, res => {
      if (res.data?.data && res.data?.result === 0) {
        setWards(res.data?.data)
      }
    })
  }
  const handleChangeWard = (value: any) => {
    setWard(value);
    apiGo24.post(`/addresslevelfour/getAddressLevel4?provinceId=${province.id}&districtId=${district.id}&wardId=${value.id}`).then(res => {
      if (res.data?.data && res.data?.result === 0) {
        setAddress4s(res.data?.data);
      }
    })
  }
  const handleChangeDelivery = (e) => {
    const { value } = e?.target;
    setPartnerDeliveryId(parseInt(value));
    const delivery = partnerDelivery?.find(p => p.id === parseInt(value));
    if (delivery) {
      setDelivery(delivery);
    }
    changeTab(TabInfo.CreateOrder);
  }
  const handleChangeShopLocation = (e) => {
    const { value } = e?.target;
    const shopLocation = shopLocations.find(shop => shop.id === value);
    if (shopLocation) setShopLocation(shopLocation);
  }
  const debounceSearch = useCallback(debounce((nextValue) => detachSearch(nextValue), 1000), []);// eslint-disable-line react-hooks/exhaustive-deps
  const detachSearch = async (value) => {
    let response = await Go24Repository.GetsPhoneNumber(value);
    if (response && response.code === 'Success' && response.data) {
      setInfoSelects(response.data);
    }
  }
  const handleChangeinfoSelects = async (value) => {
    if (typeof value === 'string') {
      setPhoneNumber(value);
      debounceSearch(value);
    } else {
      let infoSelectN = infoSelects?.find(p => p?.phoneNumber === value?.phoneNumber);
      if (infoSelectN) {
        setInfoSelect(infoSelectN);
        setPhoneNumber(infoSelectN.phoneNumber.replace(/\s/g, ''));
      };
    }

  }
  const handleSetItems = (item: ItemModel) => {
    const selectItemsClone = [...selectItems];
    let index = selectItemsClone.findIndex(i => i.id === item.id);
    if (index < 0) {
      let itemClone = { ...item, quantity: 1 };
      selectItemsClone.push(itemClone);
    } else {
      selectItemsClone[index].quantity += 1;
    }
    calculate(selectItemsClone);
    setSelectItems(selectItemsClone)
  }
  const handleVouchers = (voucher: any) => {
    setVoucher(voucher);
    inputRef.current.firstChild.focus();
    inputRef.current.firstChild.placeholder = '';
  }
  const handleChangeVoucher = (e) => {
    const { value } = e?.target;
    const _voucher = { ...voucher, code: value };
    setVoucher(_voucher);
  }
  const handleChangeNumber = (e, id) => {
    const { value } = e?.target;
    if (value < 1) return;
    const selectItemsClone = [...selectItems];
    const index = selectItemsClone.findIndex(item => item.id === id);
    if (index > -1) {
      selectItemsClone[index].quantity = parseInt(value);
      calculate(selectItemsClone);
      setSelectItems(selectItemsClone);
    }
  }

  const handleRemoveItem = (id) => {
    const selectItemsClone = [...selectItems];
    const index = selectItemsClone.findIndex(item => item.id === id);
    if (index > -1) {
      selectItemsClone.splice(index, 1);
      calculate(selectItemsClone);
      setSelectItems(selectItemsClone);
    }
  }
  const handleCollect = (e) => {
    let { value } = e?.target;
    value = value === '' ? '0' : value;
    setCollectingMoney(parseFloat(value));
  }
  const handleChangeName = (e) => {
    setFullName(e.target.value);
  }
  const debounceDetach = useCallback(debounce((nextValue, infoSelect) => detachAddress(nextValue, infoSelect), 1000), []);// eslint-disable-line react-hooks/exhaustive-deps
  const detachAddress = async (value, infoSelect) => {
    setInfoSelectStore(null);
    let response = await Go24Repository.DetachAddress(value);
    if (response?.code === 'Success' && response?.data) {
      let _infoSelect = { ...infoSelect }
      _infoSelect = {
        ..._infoSelect,
        provinceId: response?.data.provinceId,
        districtId: response?.data.districtId,
        wardId: response?.data.wardId,
        isDetach: true,
      }
      setInfoSelect(_infoSelect);
    }
  }
  const handleChangeAddress = (e) => {

    setAddress(e.target.value);
    let _infoSelect = { ...infoSelect, phoneNumber: phoneNumber ? phoneNumber : infoSelect.phone }
    debounceDetach(e.target.value, _infoSelect);
  }
  return (
    <Box>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack direction="column" sx={{ height: '100%' }} justifyContent="space-between">
          <Text sx={{
            textAlign: 'center',
            color: theme.mainColor,
            backgroundColor: theme.textColor,
            py: 1,
            fontSize: '1.25rem',
            fontWeight: 500
          }}>
            <FormattedMessage id="orders.Tạo đơn hàng mới"
              defaultMessage="Tạo đơn hàng mới" />
          </Text>
          <OrderWrapper sx={{ px: 2, py: 3}}>
            <Stack sx={{ overflowY: 'scroll', marginRight:'-6px' }}>
              <Stack>
                <Text sx={{ fontWeight: 500, color: theme.noteColor, mb: 0.5 }} variant="subtitle1" gutterBottom>
                  <FormattedMessage
                    id="orders.Địa chỉ lấy hàng"
                    defaultMessage="Địa chỉ lấy hàng"
                  /></Text>
                {shopLocation?.id ?
                  <RHFTextField value={shopLocation.id} name="shopLocationId" select label={translate('orders.Địa chỉ lấy hàng *', 'Địa chỉ lấy hàng *')} onChangeParent={handleChangeShopLocation}>
                    {shopLocations?.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </RHFTextField>
                  :
                  <RHFTextField name="shopLocationId" select label={translate('orders.Địa chỉ lấy hàng *', 'Địa chỉ lấy hàng *')} onChangeParent={handleChangeShopLocation}>
                    {shopLocations?.map((option) => (
                      <MenuItem key={option.id} value={option.id}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </RHFTextField>
                }
              </Stack>
              <Text sx={{ fontWeight: 500, color: theme.noteColor, mb: 0.5, mt: 3 }} variant="subtitle1" gutterBottom>
                <FormattedMessage
                  id="orders.Thông tin người nhận"
                  defaultMessage="Thông tin người nhận"
                /></Text>
              <Stack spacing={1} mb={3}>
                <Stack direction="row" spacing={2}>
                  <RHFSelect
                    freeSolo
                    id="combo-box-phoneNumber"
                    name='phoneNumber'
                    options={infoSelects}
                    valueN={infoSelect}
                    onChangeParent={handleChangeinfoSelects}
                    label={translate('orders.Số điện thoại *', 'Số điện thoại *')}

                  />
                  <RHFTextField
                    name="fullName"
                    value={fullName}
                    label={translate('orders.Họ và tên', 'Họ và tên')}
                    type='text'
                    onChangeParent={handleChangeName}
                  />
                </Stack>
                <RHFTextField
                  name="address"
                  value={address}
                  label={translate('orders.Địa chỉ chi tiết *', 'Địa chỉ chi tiết *')}
                  type='text'
                  onChangeParent={handleChangeAddress}
                />
                <Stack direction="row" spacing={2} mb={3}>
                  <RHFSelect
                    freeSolo
                    id="combo-box-province"
                    name='provinceId'
                    valueN={province}
                    options={provinces}
                    onChangeParent={handleChangeProvince}
                    label={translate('orders.Tỉnh/Thành phố *', 'Tỉnh/Thành phố *')}
                  />
                  <RHFSelect
                    freeSolo
                    id="combo-box-district"
                    name='districtId'
                    valueN={district}
                    options={districts}
                    onChangeParent={handleChangeDistrict}
                    label={translate('orders.Quận/Huyện *', 'Quận/Huyện *')}
                  />
                </Stack>
                <Stack direction="row" spacing={2} mb={3}>
                  <RHFSelect
                    freeSolo
                    id="combo-box-ward"
                    name='wardId'
                    valueN={ward}
                    options={wards}
                    onChangeParent={handleChangeWard}
                    label={translate('orders.Phường/Xã *', 'Phường/Xã *')}
                  />
                  <RHFSelect
                    freeSolo
                    id="combo-box-level4"
                    name='addressLevel4'
                    valueN={address4}
                    options={address4s}
                    onChangeParent={(value) => setAddress4(value)}
                    label={translate('orders.Đường/Tòa nhà/Ngõ', 'Đường/Tòa nhà/Ngõ')}
                  />
                </Stack>
              </Stack>
              <Text sx={{ fontWeight: 500, color: theme.noteColor }} variant="subtitle1" gutterBottom>
                <FormattedMessage
                  id="orders.Nội dung hàng hóa"
                  defaultMessage="Nội dung hàng hóa"
                /></Text>

              <Stack direction="row" spacing={2} mb={3}>
                <RHFTextField name="shopCode" label={translate('orders.Mã đơn shop', 'Mã đơn shop')} value={state.shopCode} onChangeParent={(e) => setState({ ...state, shopCode: e.target.value })}>
                </RHFTextField>
                <RHFTextField name="type" value={typeDefault} select label={translate('orders.Loại sản phẩm', 'Loại sản phẩm')} onChangeParent={(e) => {
                  setTypeDefault(e.target.value);
                }}>
                  {types.current.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.name}
                    </MenuItem>
                  ))}
                </RHFTextField>
              </Stack>
              <ListItems setItems={handleSetItems} />
              <List sx={{ p: 0, mb: 3 }}>
                {selectItems?.map(item => (
                  <ListItem disablePadding key={item.id}>
                    <ListItemButton sx={{ pr: 0 }}>
                      <ListItemIcon>
                        <Avatar sx={{ borderRadius: '5px', width: 40, height: 40 }}
                          src={`${config.baseGo24Url}${item?.imageUrl}`} ><PhotoIcon sx={{ width: 40, height: 40 }} />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText primary={item?.name} sx={{
                        'span': {
                          maxWidth: '270px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          '@media (max-width:1700px)': {
                            maxWidth: '170px',
                          },
                        }
                      }} />
                      <TextField
                        id="outlined-number"
                        type="number"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        value={item.quantity}
                        size="small"
                        sx={{
                          maxWidth: '60px',
                          'fieldset, input': {
                            color: theme.noteColor,
                          }
                        }}
                        onChange={(e) => handleChangeNumber(e, item.id)}
                      />
                      <IconButton onClick={() => handleRemoveItem(item.id)} aria-label="delete" size="small">
                        <DeleteIcon fontSize="inherit" />
                      </IconButton>
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              <Stack spacing={1} mb={3}>
                <Stack direction="row" spacing={2}>
                  <TextFieldN fullWidth size="small"
                    value={collectingMoney} name="collectMoney" label={translate('orders.Tiền thu hộ', 'Tiền thu hộ')} onChange={handleCollect} InputProps={{
                      inputComponent: NumberFormatCustom,
                      autoComplete: 'new-password',
                    } as any}>
                  </TextFieldN>
                  <RHFTextField name="weight" label={translate('orders.Khối lượng (kg) *', 'Khối lượng (kg) *')} onChangeParent={(e) => setWeight(e?.target?.value)} value={weight}>
                  </RHFTextField>
                </Stack>
                <Stack direction="row" spacing={2}>
                  <RHFTextField name="insurranceFee" label={translate('orders.Giá trị bảo hiểm', 'Giá trị bảo hiểm')} value={state.insurranceFee} onChangeParent={(e) => setState({ ...state, insurranceFee: e.target.value })}>
                  </RHFTextField>
                  <RHFTextField name="typeShowItem" value={typeShowItemDefault} select label={translate('orders.Kiểu xem hàng', 'Kiểu xem hàng')} onChangeParent={(e) => {
                    setTypeShowItemDefault(e.target.value);
                  }}>
                    {typeShowItem.current.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.name}
                      </MenuItem>
                    ))}
                  </RHFTextField>
                </Stack>
                <Stack direction="row" spacing={2}>
                  <RHFTextField name="length" label={translate('orders.Dài (cm)', 'Dài (cm)')} value={state?.length} onChangeParent={(e) => setState({ ...state, length: e.target.value })}>
                  </RHFTextField>
                  <RHFTextField name="width" label={translate('orders.Rộng (cm)', 'Rộng (cm)')} value={state?.width} onChangeParent={(e) => setState({ ...state, width: e.target.value })}>
                  </RHFTextField>
                  <RHFTextField name="height" label={translate('orders.Cao (cm)', 'Cao (cm)')} value={state?.height} onChangeParent={(e) => setState({ ...state, height: e.target.value })}>
                  </RHFTextField>
                </Stack>
                <Stack direction="row" spacing={2}>
                  <TextFieldN
                    ref={inputRef}
                    defaultValue={translate('orders.Mã giảm giá', 'Mã giảm giá')}
                    fullWidth size="small" name={voucher?.name} label={translate('orders.Mã giảm giá', 'Mã giảm giá')} value={voucher?.code} onChange={handleChangeVoucher}>
                  </TextFieldN>
                  <Vouchers code={voucher?.code} setVoucher={handleVouchers} />
                </Stack>
                <RHFTextField name="note" label={translate('orders.Ghi chú', 'Ghi chú')} value={state.note} onChangeParent={(e) => setState({ ...state, note: e.target.value })}>
                </RHFTextField>
              </Stack>
              {/* <RHFCheckbox value={isCustomerPaid} name="isCustomerPaid" label="Khách trả phí vận chuyển" onChangeParent={() => setIsCustomerPaid(prev => !prev)} /> */}
              <Stack>
                <Text sx={{
                  fontWeight: 500,
                  color: theme.noteColor,
                }} variant="subtitle1" gutterBottom>
                  <FormattedMessage
                    id="orders.Đơn vị vận chuyển *"
                    defaultMessage="Đơn vị vận chuyển *"
                  /></Text>
                <Stack direction="row" spacing={1}>
                  {isLoading ? <Loader /> : (
                    <RadioGroup
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={partnerDeliveryId}
                      onChange={handleChangeDelivery}
                      sx={{ width: '100%' }}
                    >
                      {partnerDelivery?.map(partner => (
                        <Stack direction="row" spacing={3} justifyContent="space-between" alignItems="center"
                          sx={{ width: '100%' }} key={partner.id}>
                          <Stack direction="row" spacing={1} justifyContent="space-between" alignItems="center" sx={{ width: '100%' }}>
                            <FormControlLabel sx={{
                              'svg': {
                                color: theme.noteColor
                              }
                            }} value={partner.id} control={<Radio />} label={partner.name} />
                            <Typography>
                              {partner.deliveryExpectedDate}
                            </Typography>
                          </Stack>
                          <Typography sx={{ whiteSpace: 'nowrap' }}>
                            {formatNumber(partner.deliveryPrice)}
                          </Typography>
                        </Stack>
                      ))}
                    </RadioGroup>
                  )}
                </Stack>
              </Stack>
            </Stack>
          </OrderWrapper>
          <Box sx={{ px: 2, mb: 4 }}>
            <Box sx={{ border: `1px solid ${theme.borderColor}`, borderRadius: '5px', mb: 3, p: 2 }}>
              <Stack direction="row" spacing={1} justifyContent="space-between" >
                <Text>
                  <FormattedMessage id="orders.Tổng tiền hàng"
                    defaultMessage="Tổng tiền hàng" />
                </Text>
                <Text>{isEdit ? formatNumber(order?.totalTakenCustomerAmount) : formatNumber(delivery?.customerPay)}</Text>
              </Stack>
              <Stack direction="row" spacing={1} justifyContent="space-between" >
                <Text>
                  <FormattedMessage id="orders.Phí bảo hiểm"
                    defaultMessage="Phí bảo hiểm" />
                </Text>
                <Text>{isEdit ? formatNumber(order?.insurranceFee) : formatNumber(delivery?.insurranceFee)}</Text>
              </Stack>
              <Stack direction="row" spacing={1} justifyContent="space-between" >
                <Text>
                  <FormattedMessage id="orders.Phí vận chuyển"
                    defaultMessage="Phí vận chuyển" />
                </Text>
                <Text>{isEdit ? formatNumber(order?.deliveryAmount) : formatNumber(delivery?.deliveryPrice)}</Text>
              </Stack>
              <Stack direction="row" spacing={1} justifyContent="space-between" >
                <Text sx={{ fontWeight: 500 }}>
                  <FormattedMessage id="orders.Thanh toán cho Shop"
                    defaultMessage="Thanh toán cho Shop" />
                </Text>
                <Text>{isEdit ? formatNumber(order?.totalPaidShopAmount) : formatNumber(delivery?.shopPay)}</Text>
              </Stack>
            </Box>
            {isCheckEdit.current ? <LoadingButton fullWidth size="small" type="submit" variant="contained" loading={isSubmitting} sx={{
              backgroundColor: theme.noteColor, color: theme.bgColor
            }}>
              <FormattedMessage
                id="orders.Cập nhật"
                defaultMessage="Cập nhật"
              />
            </LoadingButton> :
              <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
                <LoadingButtonN fullWidth size="small" type="submit" variant="contained" loading={isSubmitting} sx={{
                  backgroundColor: theme.noteColor, color: theme.bgColor, py: 1, border: 'none',  textTransform: 'none', fontSize: '1rem'
                }}>
                  <FormattedMessage
                    id="orders.Chia sẻ link"
                    defaultMessage="Chia sẻ link"
                  />
                </LoadingButtonN>
                <LoadingButtonN fullWidth size="small" type="submit" variant="contained" loading={isSubmitting} sx={{
                  backgroundColor: theme.noteColor, color: theme.bgColor, py: 1, border: 'none', textTransform: 'none', fontSize: '1rem'
                }}>
                  <FormattedMessage
                    id="orders.Tạo đơn hàng"
                    defaultMessage="Tạo đơn hàng"
                  />
                </LoadingButtonN>
                <LoadingButtonN fullWidth size="small" type="submit" onClick={() => {
                  setIsConfirm(true)
                }} variant="contained" loading={isSubmitting} sx={{
                  backgroundColor: theme.noteColor, color: theme.bgColor, py: 1, border: 'none', textTransform: 'none', fontSize: '1rem'
                }}>
                  <FormattedMessage
                    id="orders.Tạo và xác nhận"
                    defaultMessage="Tạo và xác nhận"
                  />
                </LoadingButtonN>
              </Stack>
            }
          </Box>
        </Stack>
      </FormProvider>
    </Box>
  );
}
