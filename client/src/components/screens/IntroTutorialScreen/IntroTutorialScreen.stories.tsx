import type { Meta, StoryObj } from '@storybook/react-vite';
import { IntroTutorialScreen } from './IntroTutorialScreen';
import './IntroTutorialScreen.css';

const meta: Meta<typeof IntroTutorialScreen> = {
  title: 'Screens/IntroTutorialScreen',
  component: IntroTutorialScreen,
};

export default meta;

type Story = StoryObj<typeof IntroTutorialScreen>;

export const Default: Story = {};
