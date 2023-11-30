import { forwardRef } from "react";
import NumberFormat from "react-number-format";

export const NumberFormatCustom = forwardRef((props: any) => {
    const { inputRef, onChange, ...other } = props;

    return (
        <NumberFormat
            // ref={ref}
            {...other}
            getInputRef={inputRef}
            onValueChange={values => {
                onChange({
                    target: {
                        name: props.name,
                        value: values.value
                    }
                });
            }}
            thousandSeparator
        // isNumericString
        />
    );
})