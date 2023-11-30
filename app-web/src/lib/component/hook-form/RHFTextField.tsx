import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { styled, TextField } from '@mui/material';
import { useChatStore } from '../../../store/chatStore';

// ----------------------------------------------------------------------

RHFTextField.propTypes = {
  name: PropTypes.string,
  onChangeParent: PropTypes.oneOfType([
    PropTypes.func.isRequired,
    PropTypes.oneOf([null]).isRequired,
  ]).isRequired,
};

const TextFieldWrapper = styled(TextField)(() => {
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

    'fieldset': {
      color: theme.color,
      borderColor: theme.noteColor,
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
export default function RHFTextField({ name, onChangeParent, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange, ...field }, fieldState: { error } }) => (
        <TextFieldWrapper
          {...field}
          fullWidth
          value={typeof value === 'number' && value === 0 && name !== 'type' && name !== 'typeShowItem' ? '' : value}
          error={!!error}
          helperText={error?.message}
          {...other}
          onChange={(e) => {
            onChange(e);
            onChangeParent(e);
          }}
          size="small"
        />
      )}
    />
  );
}
