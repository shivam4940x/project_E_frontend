/* eslint-disable @typescript-eslint/no-explicit-any */

import { TextField } from "@mui/material";
import type {
  UseFormRegister,
  RegisterOptions,
  FieldValues,
  Path,
} from "react-hook-form";

interface CustomTextFieldProps<T extends FieldValues> {
  label?: string;
  type: string;
  fullWidth?: boolean;
  variant: "outlined" | "filled" | "standard";
  register: UseFormRegister<T>; // Now constrained to FieldValues
  name: Path<T>; // Constrained to Path<T> instead of keyof T
  error?: any;
  helperText?: string;
  placeholder?: string;
  validation?: RegisterOptions<T, Path<T>>; // Constrained to Path<T> for validation rules
  className?: string;
  InpclassName?: string;
  inputLabelClass?: string;
  disabled?: boolean;
}

const CustomTextField = <T extends FieldValues>({
  label,
  type,
  fullWidth = false,
  variant,
  register,
  name,
  placeholder,
  error,
  helperText,
  validation,
  disabled,
  inputLabelClass,
  className,
  InpclassName,
}: CustomTextFieldProps<T>) => {
  return (
    <TextField
      label={label}
      placeholder={placeholder}
      type={type}
      fullWidth={fullWidth}
      disabled={disabled}
      variant={variant}
      {...register(name, validation)} 
      error={!!error}
      helperText={helperText}
      className={`${className}`}
      slotProps={{
        htmlInput: {
          className: `px-1 text-white-l ${InpclassName} `,
        },
        inputLabel: {
          className: `px-1 text-white-l/70 ${inputLabelClass}`,
        },
      }}
    />
  );
};

export { CustomTextField };
