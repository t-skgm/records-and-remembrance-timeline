import type { Preview } from "@storybook/nextjs";

const enableFullscreen = process.env.STORYBOOK_ENABLE_FULLSCREEN === "true";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: enableFullscreen ? "fullscreen" : "padded",
  },
};

export default preview;
