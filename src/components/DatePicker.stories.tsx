import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { DatePicker } from "./DatePicker";
import { DatePickerThemeProvider } from "../theme/datePickerProvider";

const meta: Meta<typeof DatePicker> = {
  title: "Components/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
  args: {
    color: "primary",
    size: "medium",
    variant: "outlined",
    placeholder: "Pick a date",
    firstDayOfWeek: 0,
    clearable: true,
    showToday: true,
    floatingLabel: true,
    label: "Date"
  },
  argTypes: {
    color: { control: { type: "select" }, options: ["primary", "secondary", "success", "error", "warning", "info"] },
    size: { control: { type: "select" }, options: ["small", "medium", "large"] },
    variant: { control: { type: "select" }, options: ["outlined", "filled", "standard"] },
    firstDayOfWeek: { control: { type: "number", min: 0, max: 6 } }
  }
};

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Playground: Story = {
  render: (args) => {
    const [val, setVal] = useState<Date | null>(null);
    return <DatePicker {...args} value={val} onChange={setVal} />;
  }
};

export const Variants: Story = {
  render: (args) => {
    const [a, setA] = useState<Date | null>(null);
    const [b, setB] = useState<Date | null>(null);
    const [c, setC] = useState<Date | null>(null);
    return (
      <div style={{ display: "grid", gap: 16 }}>
        <DatePicker {...args} variant="outlined" value={a} onChange={setA} label="Outlined" />
        <DatePicker {...args} variant="filled" value={b} onChange={setB} label="Filled" />
        <DatePicker {...args} variant="standard" value={c} onChange={setC} label="Standard" />
      </div>
    );
  }
};

export const WithConstraints: Story = {
  render: (args) => {
    const [val, setVal] = useState<Date | null>(null);
    const min = new Date();
    const max = new Date();
    max.setDate(max.getDate() + 14);
    return <DatePicker {...args} value={val} onChange={setVal} minDate={min} maxDate={max} />;
  }
};

export const Themed: Story = {
  render: (args) => {
    const [val, setVal] = useState<Date | null>(null);
    return (
      <DatePickerThemeProvider theme={{
        colors: { primary: { main: "#0ea5e9", hover: "#0284c7", text: "#0f172a", border: "#94a3b8", focus: "#0ea5e9" } as any },
        surface: { headerBackground: "#0f172a", headerText: "#e2e8f0" } as any
      }}>
        <DatePicker {...args} value={val} onChange={setVal} color="primary" />
      </DatePickerThemeProvider>
    );
  }
};
