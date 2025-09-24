import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  framework: {
    name: "@storybook/react-vite",
    options: {}
  },
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-interactions"
  ],
  docs: {
    autodocs: true
  },
  async viteFinal(config) {
    // Ensure a single React instance and proper pre-bundling
    config.resolve = config.resolve || {};
    config.resolve.dedupe = [
      ...(config.resolve.dedupe || []),
      "react",
      "react-dom",
      "react/jsx-runtime"
    ];
    config.optimizeDeps = config.optimizeDeps || {};
    config.optimizeDeps.include = [
      ...(config.optimizeDeps.include || []),
      "react",
      "react-dom",
      "react/jsx-runtime"
    ];
    return config;
  }
};

export default config;
