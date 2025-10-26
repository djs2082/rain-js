import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { useDynamicForm } from "../hooks/useDynamicForm";
import { DatePickerThemeProvider } from "../theme/datePickerProvider";
import { TimePickerThemeProvider } from "../theme/timePickerProvider";

const meta: Meta = {
  title: "Hooks/useDynamicForm/Examples",
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: () => {
    const { form, values } = useDynamicForm({
      fields: [
        { name: "name", label: "Full Name", required: true, inputProps: { floatingLabel: true } },
        { name: "email", label: "Email", type: "email", validators: ["required", "email"], inputProps: { floatingLabel: true } },
        { name: "date", label: "Date", type: "date", defaultValue: null, datePickerProps: { floatingLabel: true } },
        { name: "time", label: "Time", type: "time", defaultValue: null, timePickerProps: { format: "24h", minuteStep: 15 } },
      ],
      submit: {
        label: "Submit",
        onSubmit: async (vals) => alert("Submitted\n" + JSON.stringify(vals, null, 2))
      }
    });
    return (
      <div style={{ display: "grid", gap: 16 }}>
        {form}
        <div>
          <strong>Live values</strong>
          <pre>{JSON.stringify(values, null, 2)}</pre>
        </div>
      </div>
    );
  }
};

export const WithTheming: Story = {
  render: () => {
    const { form } = useDynamicForm({
      fields: [
        { name: "date", label: "Date", type: "date", defaultValue: null, datePickerProps: { floatingLabel: true } },
        { name: "time", label: "Time", type: "time", defaultValue: null, timePickerProps: { format: "12h" } },
      ],
      submit: { label: "Save" }
    });
    return (
      <DatePickerThemeProvider theme={{ surface: { headerBackground: "#0f172a", headerText: "#e2e8f0" } as any }}>
        <TimePickerThemeProvider theme={{ colors: { primary: { main: "#10b981", hover: "#059669", text: "#0f172a", border: "#94a3b8", focus: "#10b981" } as any } }}>
          {form}
        </TimePickerThemeProvider>
      </DatePickerThemeProvider>
    );
  }
};
