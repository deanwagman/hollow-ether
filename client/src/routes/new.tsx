import { useCallback } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { IntroTutorialScreen } from '@/components/screens/IntroTutorialScreen';

function NewRoute() {
  const navigate = useNavigate();

  const handleComplete = useCallback(() => {
    void navigate({ to: '/game' });
  }, [navigate]);

  return <IntroTutorialScreen onComplete={handleComplete} />;
}

export const Route = createFileRoute('/new')({
  component: NewRoute,
});
