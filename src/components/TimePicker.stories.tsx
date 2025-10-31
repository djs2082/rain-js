import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { TimePicker } from "./TimePicker";
import { TimePickerThemeProvider } from "../theme/timePickerProvider";

const meta: Meta<typeof TimePicker> = {
  title: "Components/TimePicker",
  component: TimePicker,
  tags: ["autodocs"],
  args: {
    color: "primary",
    size: "medium",
    variant: "outlined",
    placeholder: "Pick a time",
    format: "24h",
    minuteStep: 5,
    clearable: true,
    showNow: true,
    floatingLabel: true,
    label: "Time"
  },
  argTypes: {
    color: { control: { type: "select" }, options: ["primary", "secondary", "success", "error", "warning", "info"] },
    size: { control: { type: "select" }, options: ["small", "medium", "large"] },
    variant: { control: { type: "select" }, options: ["outlined", "filled", "standard"] },
    format: { control: { type: "select" }, options: ["12h", "24h"] },
    minuteStep: { control: { type: "number", min: 1, max: 30 } }
  }
};

export default meta;
type Story = StoryObj<typeof TimePicker>;

export const Playground: Story = {
  render: (args) => {
    const [val, setVal] = useState<Date | null>(null);
    return <TimePicker {...args} value={val} onChange={setVal} />;
  }
};

export const Variants: Story = {
  render: (args) => {
    const [a, setA] = useState<Date | null>(null);
    const [b, setB] = useState<Date | null>(null);
    const [c, setC] = useState<Date | null>(null);
    return (
      <div style={{ display: "grid", gap: 16 }}>
        <TimePicker {...args} variant="outlined" value={a} onChange={setA} label="Outlined" />
        <TimePicker {...args} variant="filled" value={b} onChange={setB} label="Filled" />
        <TimePicker {...args} variant="standard" value={c} onChange={setC} label="Standard" />
      </div>
    );
  }
};

export const WithConstraints: Story = {
  render: (args) => {
    const [val, setVal] = useState<Date | null>(null);
    return <TimePicker {...args} value={val} onChange={setVal} minTime="09:00" maxTime="18:00" />;
  }
};

export const Themed: Story = {
  render: (args) => {
    const [val, setVal] = useState<Date | null>(null);
    return (
      <TimePickerThemeProvider theme={{
        colors: { primary: { main: "#10b981", hover: "#059669", text: "#0f172a", border: "#94a3b8", focus: "#10b981" } as any },
        surface: { headerBackground: "#ecfeff", headerText: "#134e4a" } as any
      }}>
        <TimePicker {...args} value={val} onChange={setVal} color="primary" />
      </TimePickerThemeProvider>
    );
  }
};

export const OnChangeDetail: Story = {
  name: "onChange with detail",
  render: (args) => {
    const [val, setVal] = useState<Date | null>(null);
    const [detail, setDetail] = useState<any>(null);
    return (
      <div style={{ display: "grid", gap: 12 }}>
        <TimePicker
          {...args}
          format="12h"
          value={val}
          onChange={(d, info) => {
            setVal(d);
            setDetail(info);
          }}
          label="Pick time"
        />
        <div style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace", fontSize: 12, color: "#334155" }}>
          <div><strong>Date value:</strong> {val ? val.toString() : "null"}</div>
          <div><strong>Detail:</strong> {detail ? JSON.stringify(detail, null, 2) : "null"}</div>
        </div>
      </div>
    );
  }
};
