import React, { forwardRef, useImperativeHandle } from "react";
import { Box, Grid } from "@mui/material";
import { FormProvider, useForm, UseFormSetValue } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

type FormProps<T extends z.ZodTypeAny> = {
  children: React.ReactNode;
  onSubmit: (values: any) => void;
  defaultValues: any;
  validationSchema: any
};

export type FormRef = {
  submitForm: () => void;
  setValue: UseFormSetValue<any>;
  setFormValues: (data: Record<string, any>) => void;
  errors: any;
};

const FormInner = <T extends z.ZodTypeAny>(
  { children, onSubmit, defaultValues, validationSchema }: FormProps<T>,
  ref: React.Ref<any>
) => {
  const methods = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues,
  });

  const { handleSubmit, setValue, formState } = methods;

  const setFormValues = (data: Record<string, any>) => {
    for (let key in data) {
      setValue(key as any, data[key]);
    }
  };

  useImperativeHandle(ref, () => ({
    submitForm: () => {
      void handleSubmit(onSubmit)();
    },
    setValue,
    setFormValues,
    errors: formState.errors,
  }));

  return (
    <FormProvider {...methods}>
      <Box
        component="form"
        id="dynamic-form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          padding: "20px",
          borderRadius: "12px 12px 0 0",
          background: "#FFF",
        }}
      >
        <Grid container spacing={2}>
          {children}
        </Grid>
      </Box>
    </FormProvider>
  );
};

const Form = forwardRef(FormInner) as <T extends z.ZodTypeAny>(
  props: FormProps<T> & { ref?: React.Ref<any> }
) => ReturnType<typeof FormInner>;

export default Form;
