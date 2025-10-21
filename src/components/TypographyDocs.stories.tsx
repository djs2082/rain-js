import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import Typography from "./Typography";
import { TypographyThemeProvider } from "../theme/typographyProvider";

const meta: Meta<typeof Typography> = {
  title: "Components/Typography/Documentation",
  component: Typography,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Small, themed text components: Title, SubTitle, HeaderText, BodyText, FooterText, HelperText, ErrorText, SuccessText. Wrap your app with TypographyThemeProvider to configure typography once, then use subcomponents anywhere. Each subcomponent accepts 'as', 'style', 'color', and native element props.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Typography>;

export const Basic: Story = {
  render: () => (
    <Typography>
      <Typography.Title>Page Title</Typography.Title>
      <Typography.SubTitle>Section subtitle</Typography.SubTitle>
      <Typography.HeaderText>Header text</Typography.HeaderText>
  <Typography.BodyText>Regular body content goes here (BodyText variant).</Typography.BodyText>
      <Typography.HelperText>Some helper guidance appears below an input.</Typography.HelperText>
      <Typography.ErrorText>There was a problem saving your changes.</Typography.ErrorText>
      <Typography.SuccessText>Saved successfully!</Typography.SuccessText>
      <Typography.FooterText>© 2025 Rain UI. All rights reserved.</Typography.FooterText>
    </Typography>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Quick preview of all typography variants. Use Title/SubTitle for section headings, HeaderText for smaller headers, BodyText for normal content, and the status texts for contextual messages.",
      },
    },
  },
};

export const CustomElements: Story = {
  render: () => (
    <Typography>
      <Typography.Title as="h2">Rendered as h2 but styled like Title</Typography.Title>
      <Typography.SubTitle as="h3">Rendered as h3 but styled like SubTitle</Typography.SubTitle>
      <Typography.HeaderText as="h4">Rendered as h4 but styled like HeaderText</Typography.HeaderText>
    </Typography>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "The 'as' prop lets you render a different semantic tag while keeping the same visual style. This is useful for document outline and accessibility.",
      },
      source: {
        code: `import Typography from "rain-js";
const { Title, SubTitle, HeaderText } = Typography;

<Typography>
  <Title as="h2">H2 semantically, Title visually</Title>
  <SubTitle as="h3">H3 semantically</SubTitle>
  <HeaderText as="h4">H4 semantically</HeaderText>
</Typography>`
      },
    },
  },
};

export const InlineOverrides: Story = {
  render: () => (
    <Typography>
      <Typography.Title style={{ color: "#2563eb" }}>Blue Title</Typography.Title>
      <Typography.HelperText style={{ marginTop: 12 }}>With extra top margin</Typography.HelperText>
    </Typography>
  ),
  parameters: {
    docs: {
      description: {
        story: "Prefer theme for consistency, but you can inline-override 'style' or 'color' for special cases.",
      },
      source: {
        code: `import Typography from "rain-js";
const { Title, HelperText } = Typography;

<Typography>
  <Title style={{ color: '#2563eb' }}>Blue Title</Title>
  <HelperText style={{ marginTop: 12 }}>With extra top margin</HelperText>
</Typography>`
      }
    },
  },
};

export const Themed: Story = {
  render: () => (
    <TypographyThemeProvider
      theme={{
        base: { color: "#111827", fontFamily: "Inter, system-ui, sans-serif" },
        title: { fontSize: "32px", color: "#0f172a" },
        subTitle: { color: "#334155" },
        headerText: { color: "#1f2937", fontWeight: 700 },
        bodyText: { fontSize: "15px", lineHeight: 1.7 },
        footerText: { color: "#6b7280" },
        helperText: { color: "#6b7280" },
        errorText: { color: "#dc2626" },
        successText: { color: "#16a34a" },
      }}
    >
      <Typography>
        <Typography.Title>Themed Title</Typography.Title>
        <Typography.SubTitle>Themed subtitle</Typography.SubTitle>
        <Typography.HeaderText>Themed header text</Typography.HeaderText>
        <Typography.BodyText>Themed body text</Typography.BodyText>
        <Typography.HelperText>Helper theme</Typography.HelperText>
        <Typography.ErrorText>Error theme</Typography.ErrorText>
        <Typography.SuccessText>Success theme</Typography.SuccessText>
        <Typography.FooterText>Themed footer text</Typography.FooterText>
      </Typography>
    </TypographyThemeProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Wrap with TypographyThemeProvider to set defaults globally. You can also scope a theme to a subtree by nesting providers. Inline 'color' or 'style' overrides take precedence over theme.",
      },
      source: {
        code: `import Typography, { TypographyThemeProvider } from "rain-js";

function App() {
  return (
    <TypographyThemeProvider theme={{ title: { fontSize: "32px" } }}>
      <Typography>
        <Typography.Title>Title from theme</Typography.Title>
        <Typography.HelperText>Helper text</Typography.HelperText>
      </Typography>
    </TypographyThemeProvider>
  );
}`,
      },
    },
  },
};

export const StatusExamples: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <label htmlFor="email" style={{ display: "block", marginBottom: 6 }}>Email</label>
      <input id="email" type="email" style={{ width: "100%", padding: 8, border: "1px solid #d1d5db", borderRadius: 6 }} />
      <Typography>
        <Typography.HelperText>We will never share your email.</Typography.HelperText>
        <Typography.ErrorText>Invalid email address.</Typography.ErrorText>
        <Typography.SuccessText>Looks good!</Typography.SuccessText>
      </Typography>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Typical usage around form fields. Only one status message should be visible at a time based on validation state.",
      },
    },
  },
};

export const Usage: Story = {
  render: () => (
    <Typography>
      <Typography.Title>How to use</Typography.Title>
      <Typography.HelperText>Install and import components, wrap with provider, and compose variants.</Typography.HelperText>
    </Typography>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Usage in your app. The provider sets defaults; you can override per element via props.",
      },
      source: {
        code: `// 1) Import default + provider
import Typography, { TypographyThemeProvider } from "rain-js";

// 2) Wrap your app (e.g., in root)
function Root() {
  return (
    <TypographyThemeProvider
      theme={{
        base: { color: "#111827" },
        title: { fontSize: "28px", fontWeight: 700 },
        helperText: { color: "#6b7280" },
      }}
    >
      <App />
    </TypographyThemeProvider>
  );
}

// 3) Use anywhere (optionally destructure)
function Page() {
  const { Title, SubTitle, HeaderText, BodyText, HelperText } = Typography;
  return (
    <Typography>
      <Title>Dashboard</Title>
      <SubTitle>Overview</SubTitle>
      <HeaderText as="h4">Recent</HeaderText>
      <BodyText>Standard body copy using the theme's BodyText tokens.</BodyText>
      <HelperText>Tips and guidance</HelperText>
    </Typography>
  );
}`,
      },
    },
  },
};
