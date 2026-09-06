import React from 'react'
import {FormControl,FormDescription,FormItem,FormLabel,FormMessage} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {Controller,FieldValues,Path,Control} from "react-hook-form";

interface FormFieldprops<T extends FieldValues>{
    control: Control<T>;
    name: Path<T>;
    label: string;
    placeholder?: string;
    type?: 'text' | 'email' | 'password' | 'file'

}

const FormField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
}: FormFieldprops<T>) => (
  <Controller
    name={name}
    control={control}
    render={({ field }) => (
      <FormItem>
        <FormLabel className="label">{label}</FormLabel>
        <FormControl>
          <Input
            className="input"
            type={type}
            placeholder={placeholder}
            {...field}
          />
        </FormControl>

        <FormMessage />
      </FormItem>
    )}
  />
);

export default FormField
