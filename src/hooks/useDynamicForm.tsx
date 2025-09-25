import React from "react";
import type { InputProps } from "../components/Input";
import { Input as DefaultInput } from "../components/Input";
import type { ButtonProps } from "../components/Button";
import { Button as DefaultButton } from "../components/Button";
import { useFormFieldValidator, type ValidatorKey } from "./formFieldValidator";

export type MinimalZustandStore<T extends Record<string, any>> = {
  getState?: () => T;
  setState: (
    partial: Partial<T> | ((state: T) => Partial<T>),
    replace?: boolean
  ) => void;
};

export type DynamicFieldConfig<TValues extends Record<string, any> = Record<string, any>> = {
  name: keyof TValues & string;
  label?: string;
  type?: InputProps["type"];
  placeholder?: string;
  defaultValue?: any;
  inputProps?: Omit<
    InputProps,
    "value" | "onChange" | "type" | "label" | "defaultValue" | "id"
  >;
  // Either provide a custom validator function OR a list of validator keys
  validate?: ((value: any, values: TValues) => string | undefined) | ValidatorKey[];
  // Optional alias in case you prefer a dedicated key list
  validators?: ValidatorKey[];
};

export interface DynamicFormConfig<TValues extends Record<string, any> = Record<string, any>> {
  fields: Array<DynamicFieldConfig<TValues>>;
  initialValues?: Partial<TValues>;
  submit?: {
    label?: string;
    onSubmit?: (
      values: TValues,
      event?: React.FormEvent<HTMLFormElement>
    ) => void | Promise<void>;
    disabled?: boolean | ((values: TValues) => boolean);
  };
  onChange?: (values: TValues) => void;
}

export interface UseDynamicFormOptions<TValues extends Record<string, any> = Record<string, any>> {
  InputComponent?: React.ComponentType<InputProps>;
  ButtonComponent?: React.ComponentType<ButtonProps>;
  zustandStore?: MinimalZustandStore<TValues>;
  formProps?: React.FormHTMLAttributes<HTMLFormElement>;
  // Style/class applied to the wrapper that groups all fields
  fieldsGroupStyle?: React.CSSProperties;
  fieldsGroupClassName?: string;
}

export function useDynamicForm<
  TValues extends Record<string, any> = Record<string, any>
>(
  config: DynamicFormConfig<TValues>,
  options: UseDynamicFormOptions<TValues> = {}
) {
  const { fields, initialValues, submit: submitCfg, onChange } = config;
  const {
    InputComponent = DefaultInput,
    ButtonComponent = DefaultButton,
    zustandStore,
    formProps,
    fieldsGroupStyle,
    fieldsGroupClassName,
  } = options;

  const { validate: runValidator } = useFormFieldValidator();

  const computeFieldError = React.useCallback((f: DynamicFieldConfig<TValues>, value: any, allValues: TValues) => {
    if (Array.isArray(f.validate) || Array.isArray(f.validators)) {
      const keys = (Array.isArray(f.validate) ? f.validate : []).concat(Array.isArray(f.validators) ? f.validators! : []);
      for (const key of keys) {
        const res = runValidator(key, value);
        if (res.fail) return res.message || "Invalid";
      }
      return undefined;
    }
    if (typeof f.validate === "function") {
      return f.validate(value, allValues);
    }
    return undefined;
  }, [runValidator]);

  const initial = React.useMemo(() => {
    const base: Record<string, any> = {};
    for (const f of fields) {
      const key = f.name as string;
      if (initialValues && key in initialValues) base[key] = (initialValues as any)[key];
      else if (f.defaultValue !== undefined) base[key] = f.defaultValue;
      else base[key] = "";
    }
    if (zustandStore?.getState) {
      try {
        const s = zustandStore.getState();
        for (const f of fields) {
          const key = f.name as string;
          if (s && Object.prototype.hasOwnProperty.call(s, key)) {
            base[key] = (s as any)[key];
          }
        }
      } catch {}
    }
    return base as TValues;
  }, [fields, initialValues, zustandStore]);

  const [values, setValues] = React.useState<TValues>(initial);
  const [errors, setErrors] = React.useState<Record<string, string | undefined>>({});

  const setValue = React.useCallback(
    (name: keyof TValues & string, value: any) => {
      setValues(prev => {
        const next = { ...prev, [name]: value } as TValues;
        if (zustandStore?.setState) {
          try {
            zustandStore.setState({ [name]: value } as Partial<TValues>);
          } catch {}
        }
        onChange?.(next);
        return next;
      });
    },
    [onChange, zustandStore]
  );

  const handleInputChange = React.useCallback(
    (name: keyof TValues & string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(name, e.target.value);
    },
    [setValue]
  );

  const handleSubmit = React.useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const nextErrors: Record<string, string | undefined> = {};
      for (const f of fields) {
        const msg = computeFieldError(f, (values as any)[f.name], values);
        if (msg) nextErrors[f.name as string] = msg;
      }
      setErrors(nextErrors);
      const hasError = Object.values(nextErrors).some(Boolean);
      if (!hasError) {
        await submitCfg?.onSubmit?.(values, e);
      }
    },
    [fields, submitCfg, values]
  );

  const submit = React.useCallback(async () => {
    const nextErrors: Record<string, string | undefined> = {};
    for (const f of fields) {
      const msg = computeFieldError(f, (values as any)[f.name], values);
      if (msg) nextErrors[f.name as string] = msg;
    }
    setErrors(nextErrors);
    const hasError = Object.values(nextErrors).some(Boolean);
    if (!hasError) {
      await submitCfg?.onSubmit?.(values);
      return { ok: true as const };
    }
    return { ok: false as const, errors: nextErrors };
  }, [fields, submitCfg, values]);

  const submitDisabled = React.useMemo(() => {
    const d = submitCfg?.disabled;
    return typeof d === "function" ? d(values) : !!d;
  }, [submitCfg, values]);

  const form = (
    <form onSubmit={handleSubmit} {...formProps}>
      <div className={fieldsGroupClassName} style={{ display: "flex", flexDirection: "column", gap: 28, ...fieldsGroupStyle }}>
        {fields.map(f => {
          const val = (values as any)[f.name];
          const err = errors[f.name as string];
          const { inputProps, defaultValue, validate, ...restField } = f as any;
          return (
            <InputComponent
              key={f.name as string}
              label={f.label}
              value={val}
              onChange={handleInputChange(f.name as any)}
              type={f.type as any}
              placeholder={f.placeholder}
              error={!!err}
              helperText={err}
              {...(inputProps as any)}
              {...(restField as Omit<InputProps, "value" | "onChange">)}
            />
          );
        })}
      </div>
    </form>
  );

  return { form, values, setValue, setValues, errors, handleSubmit, submit } as const;
}
