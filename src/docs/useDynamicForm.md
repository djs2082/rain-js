# useDynamicForm — Build forms from config, fast

The `useDynamicForm` hook lets you render complete forms from a simple configuration object. It ships with sensible defaults, built‑in validation integration, and support for multiple field types including Input, DatePicker, and TimePicker. You can override the underlying components at any time.

This guide walks through every prop and option with clear examples. Copy/paste any snippet into your app or Storybook to try it.

## Quick start

```tsx
import React from "react";
import { useDynamicForm } from "../hooks/useDynamicForm";

export default function QuickExample() {
  const { form, values } = useDynamicForm({
    fields: [
      { name: "email", label: "Email", type: "email", placeholder: "you@site.com", required: true, inputProps: { floatingLabel: true } },
      { name: "startDate", label: "Start date", type: "date", defaultValue: null, datePickerProps: { variant: "outlined", floatingLabel: true } },
      { name: "startTime", label: "Start time", type: "time", defaultValue: null, timePickerProps: { format: "12h", minuteStep: 15 } }
    ],
    submit: {
      label: "Create",
      onSubmit: async (vals) => console.log("submitted", vals)
    }
  });

  return (
    <div>
      {form}
      <pre>{JSON.stringify(values, null, 2)}</pre>
    </div>
  );
}
```

## Core concepts

- You declare a list of fields. The hook returns a ready-to-render `form` element.
- Each field decides which control to render via `type`:
  - Standard HTML-like input types → `Input` component
  - `"date"` → `DatePicker`
  - `"time"` → `TimePicker`
- Validation integrates with `useFormFieldValidator` via `validate` or `validators`.
- You can override the default components globally per form via `options`.

## API reference

### useDynamicForm(config, options)

Returns an object:
- `form`: React element — the rendered form
- `values`: Record<string, any> — current form values
- `setValue(name, value)`: programmatically set one field
- `setValues(next)`: replace many values at once
- `errors`: map of fieldName → error string (if any)
- `handleSubmit(event)`: submit handler bound to the `form`
- `submit()`: programmatic submit that validates and returns `{ ok: boolean, errors? }`
- `clearFieldError(name)`: clear only one field’s error
- `clearAllErrors()`: clear all errors

### DynamicFormConfig

```ts
interface DynamicFormConfig<TValues = Record<string, any>> {
  fields: Array<DynamicFieldConfig<TValues>>;
  initialValues?: Partial<TValues>;
  submit?: {
    label?: string;
    onSubmit?: (values: TValues, event?: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
    disabled?: boolean | ((values: TValues) => boolean);
  };
  onChange?: (values: TValues, delta?: { name: keyof TValues & string; value: any }) => void;
}
```

### DynamicFieldConfig

```ts
interface DynamicFieldConfig<TValues = Record<string, any>> {
  name: keyof TValues & string;
  label?: string;
  type?: InputProps["type"] | "date" | "time";
  placeholder?: string;
  defaultValue?: any;
  required?: boolean;
  inputProps?: Omit<InputProps, "value" | "onChange" | "type" | "label" | "defaultValue" | "id">;
  datePickerProps?: Omit<DatePickerProps, "value" | "onChange" | "label">;
  timePickerProps?: Omit<TimePickerProps, "value" | "onChange" | "label">;
  validate?: ((value: any, values: TValues) => string | undefined) | ValidatorKey[];
  validators?: ValidatorKey[];
}
```

### UseDynamicFormOptions

```ts
interface UseDynamicFormOptions<TValues = Record<string, any>> {
  InputComponent?: React.ComponentType<InputProps>;
  DatePickerComponent?: React.ComponentType<DatePickerProps>;
  TimePickerComponent?: React.ComponentType<TimePickerProps>;
  ButtonComponent?: React.ComponentType<ButtonProps>;
  zustandStore?: MinimalZustandStore<TValues>;
  formProps?: React.FormHTMLAttributes<HTMLFormElement>;
  fieldsGroupStyle?: React.CSSProperties;
  fieldsGroupClassName?: string;
  validatorRules?: Partial<Record<ValidatorKey, ValidationRule>>;
  validatorInstance?: ReturnType<typeof useFormFieldValidator>;
}
```

## Field types and rendering

- Input (default): any `InputProps["type"]` like `text`, `email`, `password`, `number`, `tel`, `url`, `search`.
- DatePicker: set `type: "date"`.
- TimePicker: set `type: "time"`.

The hook routes required/error/helper to the underlying control automatically.

### Example: Inputs only

```tsx
const { form } = useDynamicForm({
  fields: [
    { name: "firstName", label: "First name", placeholder: "Jane", required: true, inputProps: { floatingLabel: true } },
    { name: "email", label: "Email", type: "email", placeholder: "you@site.com", inputProps: { format: "email", floatingLabel: true } },
    { name: "phone", label: "Phone", type: "tel", inputProps: { format: "tel", telPattern: "+91 xxxx xxx", floatingLabel: true } }
  ],
  submit: { label: "Save" }
});
```

### Example: Date and time fields

```tsx
const { form } = useDynamicForm({
  fields: [
    { name: "date", label: "Date", type: "date", defaultValue: null, datePickerProps: { variant: "filled", floatingLabel: true } },
    { name: "time", label: "Time", type: "time", defaultValue: null, timePickerProps: { format: "12h", minuteStep: 15 } }
  ],
  submit: { label: "Schedule" }
});
```

## Validation

You can attach rules via validator keys or a custom function. The hook uses `useFormFieldValidator` under the hood.

```tsx
const { form, errors } = useDynamicForm({
  fields: [
    { name: "email", label: "Email", type: "email", required: true, validators: ["required", "email"] },
    { name: "date", label: "Date", type: "date", defaultValue: null, validate: (d) => (!d ? "Please select a date" : undefined) }
  ],
  submit: { label: "Continue" }
});
```

To use your own rules engine instance, provide `options.validatorInstance`. To override the default rule set, pass `validatorRules`.

## Controlled submit and onChange

```tsx
const { form, submit, values } = useDynamicForm({
  fields: [ { name: "email", label: "Email", type: "email" } ],
  submit: { label: "Send", onSubmit: async (vals) => console.log(vals) },
  onChange: (vals, delta) => console.log("change", delta, vals)
});

async function save() {
  const result = await submit();
  if (!result.ok) console.log(result.errors);
}
```

## Initial values and defaults

- `initialValues` pre-populates the form at mount.
- Per-field `defaultValue` applies when there’s no `initialValues` entry.
- If neither is provided, fields default to an empty string `""` (for text inputs). Set `defaultValue: null` for pickers.

```tsx
const { form } = useDynamicForm({
  fields: [
    { name: "title", label: "Title", defaultValue: "Hello" },
    { name: "date", label: "Date", type: "date", defaultValue: new Date() }
  ]
});
```

## Disabling submit

Disable the submit button always, or dynamically from current values.

```tsx
const { form } = useDynamicForm({
  fields: [ { name: "email", label: "Email", type: "email" } ],
  submit: {
    label: "Invite",
    disabled: (vals) => !String(vals.email || "").includes("@")
  }
});
```

## Component overrides

Swap the default components for fully custom ones.

```tsx
function MyInput(props: InputProps) { /* ... */ return <input {...props as any} />; }
function MyDatePicker(props: DatePickerProps) { /* ... */ return <div>Custom Date</div>; }
function MyTimePicker(props: TimePickerProps) { /* ... */ return <div>Custom Time</div>; }

const { form } = useDynamicForm(
  { fields: [ { name: "x", label: "X" }, { name: "d", label: "D", type: "date" }, { name: "t", label: "T", type: "time" } ] },
  { InputComponent: MyInput, DatePickerComponent: MyDatePicker, TimePickerComponent: MyTimePicker }
);
```

## Styling and layout

- Pass `fieldsGroupStyle` / `fieldsGroupClassName` to adjust the vertical stack of fields.
- Pass `formProps` to the `<form>` (e.g., id, className, style).

```tsx
const { form } = useDynamicForm(
  { fields: [ { name: "name", label: "Name" } ] },
  {
    fieldsGroupStyle: { gap: 16, maxWidth: 420 },
    formProps: { style: { padding: 12 } }
  }
);
```

## State stores (Zustand)

Provide a minimal Zustand-style store to sync values automatically.

```ts
type User = { name: string };
const store = create<User>(() => ({ name: "" }));

const { form } = useDynamicForm<User>({
  fields: [ { name: "name", label: "Name" } ]
}, {
  zustandStore: { getState: store.getState, setState: store.setState }
});
```

## Error handling helpers

- `clearFieldError(name)` — clear one error after user correction
- `clearAllErrors()` — clear all errors (e.g., when resetting the form)

```tsx
const { form, clearFieldError, clearAllErrors } = useDynamicForm({
  fields: [ { name: "email", label: "Email", validators: ["required", "email"] } ]
});
```

## Full playground example

This example mixes inputs, date, and time, with validation and a live values preview.

```tsx
import React from "react";
import { useDynamicForm } from "../hooks/useDynamicForm";

export function BookingForm() {
  const { form, values, submit } = useDynamicForm({
    fields: [
      { name: "name", label: "Full Name", required: true, inputProps: { floatingLabel: true } },
      { name: "email", label: "Email", type: "email", validators: ["required", "email"], inputProps: { floatingLabel: true } },
      { name: "date", label: "Date", type: "date", defaultValue: null, datePickerProps: { firstDayOfWeek: 1, floatingLabel: true } },
      { name: "time", label: "Time", type: "time", defaultValue: null, timePickerProps: { format: "24h", minuteStep: 15 } }
    ],
    submit: {
      label: "Book",
      onSubmit: async (vals) => alert("Booked!\n" + JSON.stringify(vals, null, 2))
    },
    onChange: (vals, delta) => console.log("change", delta)
  });

  return (
    <div>
      {form}
      <div style={{ marginTop: 16 }}>
        <strong>Live values</strong>
        <pre>{JSON.stringify(values, null, 2)}</pre>
      </div>
      <button onClick={() => submit()}>Submit programmatically</button>
    </div>
  );
}
```

## Tips

- For DatePicker/TimePicker fields, set `defaultValue: null` if you want the field initially blank.
- When using your own validators, prefer short error messages and let the picker/Input render them via `helperText`.
- Need a range picker? You can build a small wrapper field that holds `{ start: Date|null, end: Date|null }` and render two `DatePicker`s side by side.

---

For reference, the hook lives at `src/hooks/useDynamicForm.tsx`. The default components used are `Input`, `DatePicker`, `TimePicker`, and `Button` from this library, but all are swappable.
