import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { useDynamicForm } from "./useDynamicForm";
import type { MinimalZustandStore } from "./useDynamicForm";

type Values = { firstName: string; email: string };

type DemoProps = {
  submitLabel?: string;
  disableSubmit?: boolean;
  useStore?: boolean;
};

function createMockStore<T extends Record<string, any>>(initial: T): MinimalZustandStore<T> {
  let state = { ...initial } as T;
  return {
    getState: () => state,
    setState: (partial) => {
      const patch = typeof partial === "function" ? partial(state) : partial;
      state = { ...state, ...patch } as T;
    }
  };
}

const DemoForm: React.FC<DemoProps> = ({ submitLabel = "Submit", disableSubmit = false, useStore = false }) => {
  const storeRef = React.useRef<MinimalZustandStore<Values> | undefined>(undefined);
  if (useStore && !storeRef.current) {
    storeRef.current = createMockStore<Values>({ firstName: "", email: "" });
  }

  const { form, values } = useDynamicForm<Values>(
    {
      fields: [
        { name: "firstName", label: "First Name", type: "text", defaultValue: "" },
        {
          name: "email",
          label: "Email",
          type: "email",
          defaultValue: "",
          validate: (v) => (v && /@/.test(String(v)) ? undefined : "Invalid email")
        }
      ],
      submit: {
        label: submitLabel,
        disabled: disableSubmit
      }
    },
    {
      zustandStore: storeRef.current
    }
  );

  return (
    <div style={{ display: "grid", gap: 16, maxWidth: 420 }}>
      {form}
      <div>
        <div style={{ fontSize: 12, opacity: 0.7 }}>Values</div>
        <pre style={{ background: "#111", color: "#fff", padding: 12, borderRadius: 6, overflow: "auto" }}>
          {JSON.stringify(values, null, 2)}
        </pre>
      </div>
    </div>
  );
};

const meta: Meta<typeof DemoForm> = {
  title: "Hooks/useDynamicForm",
  component: DemoForm,
  tags: ["autodocs"],
  args: {
    submitLabel: "Submit",
    disableSubmit: false,
    useStore: false
  },
  argTypes: {
    submitLabel: { control: "text" },
    disableSubmit: { control: "boolean" },
    useStore: { control: "boolean" }
  }
};

export default meta;

type Story = StoryObj<typeof DemoForm>;

export const Playground: Story = {};

export const WithZustandMirror: Story = {
  args: {
    useStore: true
  }
};
