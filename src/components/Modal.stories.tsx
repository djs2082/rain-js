import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Modal } from "./Modal";
import { Button } from "./Button";

const meta: Meta<typeof Modal> = {
  title: "Components/Modal",
  component: Modal,
  parameters: { docs: { disable: true } },
  argTypes: {
    crossButton: { control: "boolean" },
    disableBackdropClose: { control: "boolean" },
    closeOnEscape: { control: "boolean" },
    width: { control: "text" },
    height: { control: "text" },
    ariaLabel: { control: "text" },
    show: { control: { disable: true } },
    header: { control: { disable: true } },
    children: { control: { disable: true } },
    footerButtons: { control: { disable: true } }
  },
  args: {
    crossButton: true,
    disableBackdropClose: false,
    closeOnEscape: true,
    width: "600px",
    height: "auto",
    ariaLabel: "Modal dialog"
  }
};
export default meta;

type Story = StoryObj<typeof Modal>;

const ModalExample = (args: any) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button onClick={() => setOpen(true)}>Open Modal</button>
      <Modal
        {...args}
        show={open}
        onClose={() => setOpen(false)}
        header={<strong>Example Modal</strong>}
        footerButtons={[
          {
            key: "cancel",
            node: <Button onClick={() => setOpen(false)}>Cancel</Button>
          },
          {
            key: "ok",
            node: <Button onClick={() => setOpen(false)}>OK</Button>
          }
        ]}
      >
        <p>This is the modal body. You can put anything here.</p>
      </Modal>
    </div>
  );
};

export const Basic: Story = {
  render: (args) => <ModalExample {...args} />
};
