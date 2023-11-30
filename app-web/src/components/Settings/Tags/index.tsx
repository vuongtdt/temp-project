import { FormattedMessage } from 'react-intl'
import { useChatStore } from 'store/chatStore';
import { Box, Button, Grid, IconButton, Stack, Switch } from '@mui/material';
import { ChatGo24Repository } from 'repositories/ChatGo24Repository';
import { useEffect, useState } from 'react';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddBoxIcon from '@mui/icons-material/AddBox';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import { ChromePicker } from 'react-color';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import { useAlertStore } from 'store/alertStore';
import translate from '../../../translations';
import { useTagsStore } from 'store/tagsStore';
import { Text, TextFieldN } from 'components/re-skin';

export interface ITags {
  id?: string,
  tagName: string,
  colorCode: string,
  isActive: boolean
}

const Tags = () => {
  const { theme } = useChatStore();
  const { setIsOpenAlert, setAlert, setType } = useAlertStore();
  const { tags, setTags } = useTagsStore();
  const [isAdd, setIsAdd] = useState(false);
  const [tagEdit, setTagEdit] = useState<ITags>({} as ITags);
  const [isOpenColor, setIsOpenColor] = useState(false);
  const [tagNew, setTagNew] = useState<ITags>({} as ITags);
  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const init = async () => {
    const response = await ChatGo24Repository.GetTags();
    if (response) setTags(response);
  }
  const isValid = (tag: ITags): boolean => {
    let isShow = false;
    if (!tag?.tagName) {
      setAlert('Tên nhãn không được bỏ trống')
      isShow = true;
    } else if (!tag?.colorCode) {
      setAlert('Vui lòng chọn màu cho nhãn')
      isShow = true;
    }
    if (isShow) {
      setType('error');
      setIsOpenAlert(true);
    }
    return isShow;
  }
  const popover = {
    position: 'absolute',
    zIndex: '2',
  }
  const cover = {
    position: 'fixed',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
  }
  const handleAdd = async () => {
    if (isValid(tagNew)) return;
    const _tagNew = { ...tagNew, id: '' };
    const response = await ChatGo24Repository.AddTag(_tagNew);
    if (response && response.error) {
      setAlert('Thêm nhãn thất bại');
    } else {
      // setTags([...tags, _tagNew]);
      setAlert('Thêm nhãn thành công');
      setType('success');
      init();
    }
    setIsOpenAlert(true);
    handleCancel();
  }
  const handleCancel = () => {
    isAdd ? setTagNew(null) : setTagEdit(null);
    setIsAdd(false);
  }
  const handleDelete = async (id: string) => {
    const response = await ChatGo24Repository.DeleteTag(id);
    if (response && response.error) {
      setAlert('Xóa nhãn thất bại');
    } else if (response) {
      let index = tags?.findIndex(tag => tag.id === id);
      if (index > -1) tags.splice(index, 1);
      setAlert(translate('Xóa nhãn thành công', 'Xóa nhãn thành công'));
      setType('success');
    }
  }
  const handleEdit = async () => {
    if (isValid(tagEdit)) return;
    const response = await ChatGo24Repository.EditTag(tagEdit);
    if (response && response.error) {
      setAlert(translate('Chỉnh nhãn thất bại', 'Chỉnh nhãn thất bại'));
    } else if (response) {
      let _tags = tags.map(tag => {
        if (tag.id === tagEdit.id) {
          tag = tagEdit;
        }
        return tag;
      })
      setTags(_tags);
      setAlert(translate('Chỉnh nhãn thành công', 'Chỉnh nhãn thành công'));
      setType('success');
    }
    setIsOpenAlert(true);
    handleCancel();
  }
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ borderBottom: `1px solid ${theme.borderColor}` }}>
        <Text sx={{ fontWeight: 500, color: theme.noteColor, pb: 1, }} variant="h6" gutterBottom><FormattedMessage
          id="tags.Danh sách nhãn dán"
          defaultMessage="Danh sách nhãn dán"
        /></Text>
        {!isAdd && <Button sx={{ textTransform: 'none' }} onClick={() => setIsAdd(true)} >
          <AddBoxIcon color="success" />
          <Text gutterBottom><FormattedMessage
            id="tags.Tạo nhãn"
            defaultMessage="Tạo nhãn"
          /></Text>
        </Button>}
      </Stack>
      <Grid container sx={{ mt: 2 }}>
        <Grid sx={{
          backgroundColor: theme.bgColor,
          p: 1
        }} item container spacing={0.5}>
          <Grid item xs={3}>
            <Text sx={{ fontWeight: 500, color: theme.color }} gutterBottom><FormattedMessage
              id="tags.Tên nhãn"
              defaultMessage="Tên nhãn"
            /></Text>
          </Grid>
          <Grid item xs={4}>
            <Text sx={{ fontWeight: 500, color: theme.color }} gutterBottom><FormattedMessage
              id="tags.Màu sắc"
              defaultMessage="Màu sắc"
            /></Text>
          </Grid>
          <Grid item xs={3}>
            <Text sx={{ fontWeight: 500, color: theme.color }} gutterBottom><FormattedMessage
              id="tags.Trạng thái hoạt động"
              defaultMessage="Trạng thái hoạt động"
            /></Text>
          </Grid>
          <Grid item xs={2}>
            <Text sx={{ fontWeight: 500, color: theme.color }} gutterBottom><FormattedMessage
              id="tags.Thao tác"
              defaultMessage="Thao tác"
            /></Text>
          </Grid>
        </Grid>
        {isAdd && <Grid item container
          sx={{ backgroundColor: theme.bgColor, p: 1 }} spacing={0.5}>
          <Grid item xs={3}>
            <TextFieldN fullWidth size="small" variant="standard" type="text" value={tagNew?.tagName} className="texfield-info" name="tagname"
              InputProps={{
                autoComplete: 'new-password',
              }}
              onChange={(e) => setTagNew({ ...tagNew, tagName: e.target.value })} />
          </Grid>
          <Grid item xs={4}>
            <IconButton onClick={() => setIsOpenColor(!isOpenColor)}>
              <LocalOfferIcon sx={{ color: tagNew?.colorCode }} />
            </IconButton>
            <Box>
              {isOpenColor && isAdd ? <Box sx={popover}>
                <Box sx={cover} onClick={() => setIsOpenColor(false)} />
                <ChromePicker
                  color={tagNew?.colorCode}
                  onChangeComplete={(color) => {
                    setTagNew({ ...tagNew, colorCode: color.hex })
                  }}
                />
              </Box> : null}
            </Box>

          </Grid>
          <Grid item xs={3}>
            <Switch
              checked={tagNew?.isActive}
              inputProps={{ 'aria-label': 'controlled' }}
              onChange={(e) => setTagNew({ ...tagNew, isActive: e.target.checked })}
            />
          </Grid>
          <Grid item xs={2}>
            <IconButton>
              <CheckOutlinedIcon onClick={handleAdd} color="success" />
            </IconButton>
            <IconButton>
              <ClearOutlinedIcon onClick={handleCancel} color="error" />
            </IconButton>
          </Grid>
        </Grid>}
        {tags?.map(tag => {
          return (
            tag.id !== tagEdit?.id ? <Grid item container
              sx={{
                px: 1,
                alignItems: 'center',
                '&:hover, &.active': {
                  backgroundColor: theme.bgColor
                }
              }} spacing={0.5} key={tag.id}>
              <Grid item xs={3}>
                <Text gutterBottom>
                  {tag.tagName}
                </Text>
              </Grid>
              <Grid item xs={4}>
                <IconButton>
                  <LocalOfferIcon sx={{ color: tag.colorCode }} /></IconButton>
              </Grid>
              <Grid item xs={3}>
                <Switch
                  checked={tag.isActive}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              </Grid>
              <Grid item xs={2}>
                <IconButton onClick={() => setTagEdit(tag)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(tag.id)}>
                  <DeleteForeverIcon color='error' />
                </IconButton>
              </Grid>
            </Grid> :
              <Grid item container
                sx={{ backgroundColor: theme.bgColor, p: 1 }} spacing={0.5}>
                <Grid item xs={3}>
                  <TextFieldN fullWidth size="small" variant="standard" type="text" value={tagEdit?.tagName} className="texfield-info" name="tagname"
                    InputProps={{
                      autoComplete: 'new-password',
                    }}
                    onChange={(e) => setTagEdit({ ...tagEdit, tagName: e.target.value })} />
                </Grid>
                <Grid item xs={4}>
                  <IconButton onClick={() => setIsOpenColor(!isOpenColor)}>
                    <LocalOfferIcon sx={{ color: tagEdit?.colorCode }} />
                  </IconButton>
                  <Box>
                    {isOpenColor ? <Box sx={popover}>
                      <Box sx={cover} onClick={() => setIsOpenColor(false)} />
                      <ChromePicker
                        color={tagEdit?.colorCode}
                        onChangeComplete={(color) => {
                          setTagEdit({ ...tagEdit, colorCode: color.hex })
                        }}
                      />
                    </Box> : null}
                  </Box>

                </Grid>
                <Grid item xs={3}>
                  <Switch
                    checked={tagEdit?.isActive}
                    inputProps={{ 'aria-label': 'controlled' }}
                    onChange={(e) => setTagEdit({ ...tagEdit, isActive: e.target.checked })}
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton>
                    <CheckOutlinedIcon onClick={handleEdit} color="success" />
                  </IconButton>
                  <IconButton>
                    <ClearOutlinedIcon onClick={handleCancel} color="error" />
                  </IconButton>
                </Grid>
              </Grid>
          )
        })}

      </Grid>
    </Box >
  )
}

export default Tags
