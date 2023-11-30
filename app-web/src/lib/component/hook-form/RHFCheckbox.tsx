import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material';
import { useChatStore } from 'store/chatStore';

// ----------------------------------------------------------------------

RHFCheckbox.propTypes = {
  name: PropTypes.string.isRequired,
  onChangeParent: PropTypes.oneOfType([
    PropTypes.func.isRequired,
    PropTypes.oneOf([null]).isRequired,
  ]).isRequired,
  value: PropTypes.bool.isRequired,
};

export function RHFCheckbox({ label, name, value, onChangeParent, ...other }) {
  const { control } = useFormContext();
  const { theme } = useChatStore();

  return (
    <FormControlLabel
      control={
        <Controller
          name={name}
          control={control}
          render={({ field }) => <Checkbox
            sx={{
              'svg': {
                color: theme.noteColor
              }
            }}
            {...field} checked={value}
            onChange={(e) => {
              field.onChange(e);
              onChangeParent(e);
            }} />}
        />
      }
      label={<Typography>{label}</Typography>}
      {...other}
    />
  );
}

// ----------------------------------------------------------------------

RHFMultiCheckbox.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
};

export function RHFMultiCheckbox({ name, options, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const onSelected = (option) =>
          field.value.includes(option) ? field.value.filter((value) => value !== option) : [...field.value, option];

        return (
          <FormGroup>
            {options.map((option) => (
              <FormControlLabel
                key={option.value}
                control={
                  <Checkbox
                    checked={field.value.includes(option.value)}
                    onChange={() => field.onChange(onSelected(option.value))}
                  />
                }
                label={option.label}
                {...other}
              />
            ))}
          </FormGroup>
        );
      }}
    />
  );
}
