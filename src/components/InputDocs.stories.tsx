import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { Input } from "./Input";

/**
 * # Input
 * 
 * A versatile Input component with variants, sizes, formatting options, and theming support.
 * 
 * The Input component provides three visual variants, six color palettes, three sizes, and supports
 * features like floating labels, adornments, helper text, and password visibility toggle.
 * It also includes input formatting options for common use cases.
 * 
 * ## Props
 * 
 * Key props:
 * - `variant`: "outlined" | "filled" | "standard"
 * - `color`: "primary" | "secondary" | "success" | "error" | "warning" | "info"
 * - `size`: "small" | "medium" | "large"
 * - `label`: Text label for the input field
 * - `helperText`: Supporting text displayed below the input
 * - `error`: boolean to indicate error state
 * - `fullWidth`: boolean to stretch to container width
 * - `floatingLabel`: Makes the label float when focused or has value
 * - `startAdornment` / `endAdornment`: React nodes rendered before/after the input
 * - `showPasswordToggle`: Show/hide toggle for password fields
 * - `format`: "none" | "tel" | "email" | "url" formatting helpers
 * - `telPattern`: Custom phone number mask pattern (e.g., "+91 xxxx xxx")
 * - Plus all standard input HTML attributes (onChange, type, required, etc.)
 */

const meta: Meta<typeof Input> = {
  title: "Components/Input/Documentation",
  component: Input,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: "A versatile Input component with variants, sizes, formatting options, and theming support."
      }
    }
  }
};

export default meta;

type Story = StoryObj<typeof Input>;

/**
 * ## Quick Usage
 * 
 * The Input component can be used with various props to create different visual styles.
 */
export const QuickUsage: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
      <div>
        <h3>Basic input</h3>
        <Input label="Name" placeholder="Enter your name" />
      </div>
      
      <div>
        <h3>Variants</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input variant="outlined" label="Outlined" placeholder="Default variant" />
          <Input variant="filled" label="Filled" placeholder="With background" />
          <Input variant="standard" label="Standard" placeholder="Just a bottom line" />
        </div>
      </div>
      
      <div>
        <h3>Sizes</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input size="small" label="Small" placeholder="Small size" />
          <Input size="medium" label="Medium" placeholder="Default size" />
          <Input size="large" label="Large" placeholder="Large size" />
        </div>
      </div>
      
      <div>
        <h3>States</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input label="Regular" placeholder="Regular state" />
          <Input label="Disabled" placeholder="Can't edit this" disabled />
          <Input label="Error" placeholder="With error" error helperText="Something went wrong" />
          <Input label="With helper" helperText="Supporting information" />
        </div>
      </div>
    </div>
  )
};

/**
 * ## Floating Label
 * 
 * The Input component supports a floating label that moves up when the field is focused or has content.
 */
export const FloatingLabelDemo: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
      <div>
        <h3>Floating label inputs</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 30, maxWidth: 320 }}>
          <Input 
            variant="outlined" 
            label="Name" 
            placeholder="Enter your name" 
            floatingLabel
          />
          <Input 
            variant="filled" 
            label="Email" 
            placeholder="name@example.com" 
            type="email"
            floatingLabel
          />
          <Input 
            variant="standard" 
            label="Password" 
            type="password" 
            floatingLabel
          />
        </div>
      </div>
      
      <div style={{ marginTop: 20 }}>
        <h3>Interactive demo</h3>
        <FloatingLabelInteractive />
      </div>
    </div>
  )
};

// Interactive example component for floating label
const FloatingLabelInteractive = () => {
  const [value, setValue] = useState("");
  
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 320 }}>
      <Input
        label="Interactive field"
        placeholder="Type something..."
        floatingLabel
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div style={{ display: "flex", gap: 16 }}>
        <button onClick={() => setValue("")} style={{ padding: "8px 16px" }}>
          Clear
        </button>
        <button 
          onClick={() => setValue("Hello World!")}
          style={{ padding: "8px 16px" }}
        >
          Add text
        </button>
      </div>
    </div>
  );
};

/**
 * ## Adornments
 * 
 * Add icons or text before or after the input value.
 */
export const AdornmentsDemo: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 320 }}>
      <Input 
        label="Price" 
        placeholder="0.00" 
        startAdornment={<span>$</span>} 
        floatingLabel
      />
      
      <Input 
        label="Weight" 
        placeholder="0.00" 
        endAdornment={<span>kg</span>} 
        floatingLabel
      />
      
      <Input 
        label="Stock price" 
        placeholder="0.00" 
        startAdornment={<span>$</span>} 
        endAdornment={<span>USD</span>} 
        floatingLabel
      />
      
      <Input 
        label="Search" 
        placeholder="Type to search..." 
        startAdornment={
          <span style={{ display: "inline-flex" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
          </span>
        } 
      />
    </div>
  )
};

/**
 * ## Password Fields
 * 
 * Input supports password fields with an optional visibility toggle button.
 */
export const PasswordDemo: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 320 }}>
      <Input 
        type="password" 
        label="Password" 
        placeholder="Enter password" 
        floatingLabel 
      />
      
      <Input 
        type="password" 
        label="Password without toggle" 
        placeholder="Enter password" 
        showPasswordToggle={false} 
        floatingLabel 
      />
      
      <div>
        <h4>Standard login form</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input 
            label="Email" 
            placeholder="name@example.com" 
            type="email" 
          />
          <Input 
            type="password" 
            label="Password" 
            helperText="Must be at least 8 characters"
          />
          <button style={{ padding: "8px 16px", marginTop: 8 }}>
            Log in
          </button>
        </div>
      </div>
    </div>
  )
};

/**
 * ## Input Formatting
 * 
 * The Input component includes automatic formatting for common input types.
 * 
 * - `format="tel"`: Formats phone numbers (supports custom patterns with `telPattern`)
 * - `format="email"`: Removes spaces and normalizes to lowercase
 * - `format="url"`: Trims whitespace
 */
export const FormattingDemo: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 30, maxWidth: 320 }}>
      <div>
        <h3>Phone number formatting</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input 
            label="US Phone" 
            placeholder="(555) 123-4567" 
            format="tel" 
            floatingLabel 
          />
          
          <Input 
            label="India Phone" 
            placeholder="+91 98765 43210" 
            format="tel"
            telPattern="+91 xxxxx xxxxx"
            floatingLabel 
          />
          
          <Input 
            label="UK Phone" 
            placeholder="+44 7123 456789" 
            format="tel"
            telPattern="+44 xxxx xxxxxx"
            floatingLabel 
          />
        </div>
      </div>
      
      <div>
        <h3>Email & URL formatting</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Input 
            label="Email" 
            placeholder="name@example.com" 
            type="email"
            format="email"
            floatingLabel 
            helperText="Removes spaces, converts to lowercase"
          />
          
          <Input 
            label="Website" 
            placeholder="https://example.com" 
            type="url"
            format="url"
            floatingLabel 
            helperText="Trims whitespace"
          />
        </div>
      </div>
    </div>
  )
};

/**
 * ## Error States
 * 
 * Input supports error states with optional helper text.
 */
export const ErrorStateDemo: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 320 }}>
      <Input 
        label="Email" 
        placeholder="name@example.com"
        error
        helperText="Invalid email address" 
      />
      
      <Input 
        label="Password" 
        type="password"
        error
        helperText="Password must be at least 8 characters" 
        floatingLabel 
      />
      
      <div style={{ marginTop: 20 }}>
        <h3>Form validation example</h3>
        <ValidationExample />
      </div>
    </div>
  )
};

// Form validation example component
const ValidationExample = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  
  const validate = () => {
    // Simple validation
    const isEmailValid = /\S+@\S+\.\S+/.test(email);
    const isPasswordValid = password.length >= 8;
    
    setEmailError(!isEmailValid);
    setPasswordError(!isPasswordValid);
    
    if (isEmailValid && isPasswordValid) {
      alert("Form is valid! Ready to submit.");
    }
  };
  
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Input 
        label="Email" 
        placeholder="name@example.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (emailError) setEmailError(false);
        }}
        error={emailError}
        helperText={emailError ? "Please enter a valid email" : ""}
      />
      
      <Input 
        label="Password" 
        type="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (passwordError) setPasswordError(false);
        }}
        error={passwordError}
        helperText={passwordError ? "Password must be at least 8 characters" : ""}
      />
      
      <button 
        onClick={validate}
        style={{ padding: "8px 16px", marginTop: 8 }}
      >
        Validate
      </button>
    </div>
  );
};

/**
 * ## Full Width
 * 
 * Input can stretch to fill its container with the `fullWidth` prop.
 */
export const FullWidthDemo: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h3>Regular input</h3>
        <Input label="Name" placeholder="Enter your name" />
      </div>
      
      <div>
        <h3>Full width input</h3>
        <div style={{ border: "1px dashed #ccc", padding: 16 }}>
          <Input label="Name" placeholder="Enter your name" fullWidth />
        </div>
      </div>
      
      <div>
        <h3>In a form layout</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, border: "1px solid #eee", padding: 16, borderRadius: 4 }}>
          <Input label="Full Name" placeholder="John Doe" fullWidth />
          <Input label="Email" placeholder="john@example.com" type="email" fullWidth />
          <Input label="Message" placeholder="Your message here..." fullWidth />
          <button style={{ padding: "8px 16px", alignSelf: "flex-start", marginTop: 8 }}>
            Submit
          </button>
        </div>
      </div>
    </div>
  )
};

/**
 * ## Accessibility
 * 
 * The Input component is built with accessibility in mind:
 * - Proper label association with input via HTML `for` attribute
 * - Support for ARIA attributes
 * - Visible focus states
 * - Helper text for additional context
 * - Color contrast in error states
 */
export const AccessibilityDemo: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 320 }}>
      <div>
        <Input 
          label="Accessible input" 
          placeholder="With proper labeling"
          aria-describedby="input-desc"
        />
        <p id="input-desc" style={{ fontSize: 14, color: "#666" }}>
          This input has a properly associated label and description.
        </p>
      </div>
      
      <Input
        label="Required field"
        placeholder="This field is required"
        required
        aria-required="true"
      />
      
      <Input
        type="password"
        label="Password"
        placeholder="Enter password"
        showPasswordToggle
        aria-describedby="pwd-desc"
      />
      <p id="pwd-desc" style={{ fontSize: 14, color: "#666" }}>
        The toggle button has proper aria-label for screen readers.
      </p>
    </div>
  )
};