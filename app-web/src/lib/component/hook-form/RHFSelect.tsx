import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { Autocomplete, styled, TextField } from '@mui/material';
import { useChatStore } from '../../../store/chatStore';
import { useEffect, useState } from 'react';

// ----------------------------------------------------------------------

RHFSelect.propTypes = {
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
      padding: '2px 8px',
      // fontSize:'13px',
    },
    'label, label.Mui-disabled': {
      color: 'grey',
      fontSize: '14px',
      top: '1px',
    },

    'fieldset': {
      color: theme.color,
      borderColor: 'inherit',
      fontSize: '14px',
    },
    '.MuiOutlinedInput-root.MuiInputBase-colorPrimary': {
      color: theme.color,
    },
    '.MuiOutlinedInput-root.MuiInputBase-sizeSmall': {
      padding: '12px 8px',
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
export default function RHFSelect({ name, label, options, onChangeParent, valueN, ...other }) {
  const { control } = useFormContext();
  const [_value, setValue] = useState(valueN);

  useEffect(() => {
    if (valueN && options) {
      setValue(valueN);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueN])

  return (<Controller
    name={name}
    control={control}
    render={({ field: { ...field }, fieldState: { error } }) => (
      <Autocomplete
        inputValue={_value}
        {...field}
        {...other}
        freeSolo
        fullWidth
        value={_value || '' }
        options={options}
        getOptionLabel={(option): any => {
          if (name === 'phoneNumber') {
            return option?.phoneNumber?.replace(/\s/g, '') || '';
          } else {
            return option?.name || '';
          }
        }}
        renderOption={(props, option) => {
          if (option) {
            if (name === 'phoneNumber') {
              return <li {...props}>{`${option.fullName} - ${option.phoneNumber}`}</li>
            } else {
              return <li {...props}>{option?.name}</li>
            }
          } else {
            return <li>Loading...</li>
          }


        }}
        onInputChange={(e, newValue) => {
          name === 'phoneNumber' && onChangeParent(newValue);
        }}
        onChange={(e, newValue) => {
          setValue(newValue);
          onChangeParent(newValue);
        }}
        renderInput={(params) => <TextFieldWrapper {...params} size="small" error={!!error} helperText={error?.message} label={label}
          sx={{
            'input': {
              height: "0.7em"
            }
          }}
          inputProps={{
            ...params.inputProps,
            autoComplete: 'new-password',
          }}

        />}
      />
    )}
  />
  );
}
