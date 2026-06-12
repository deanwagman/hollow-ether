import { createFileRoute } from '@tanstack/react-router';
import { IntroTutorialScreen } from '@/components/screens/IntroTutorialScreen';

function NewRoute() {
  return <IntroTutorialScreen />;
}

export const Route = createFileRoute('/new')({
  component: NewRoute,
});
