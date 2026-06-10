import type { Preview } from '@storybook/react-vite';
import '../src/styles/fonts.css';
import '../src/styles/tokens.css';
import '../src/styles/globals.css';
import '../src/styles/typography.css';
import '../src/styles/surfaces.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },

    layout: 'fullscreen',

    backgrounds: {
      default: 'Hollow Void',
      values: [
        { name: 'Hollow Void', value: '#03080a' },
        { name: 'Abyss', value: '#061116' },
        { name: 'Deep Sea', value: '#0a1c24' },
      ],
    },
  },
};

export default preview;
