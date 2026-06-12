import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { TitleScreen } from '@/components/screens/TitleScreen';
import { GAME_SESSION_KEY } from '@/game/useGameSession';
import {
  clearStoredSessionId,
  getStoredSessionId,
} from '@/lib/gameSessionStorage';

function TitleRoute() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const hasContinue = Boolean(getStoredSessionId());

  function handleNewGame() {
    clearStoredSessionId();
    void queryClient.resetQueries({ queryKey: GAME_SESSION_KEY });
    void navigate({ to: '/new' });
  }

  function handleContinue() {
    void navigate({ to: '/game' });
  }

  return (
    <TitleScreen
      hasContinue={hasContinue}
      onNewGame={handleNewGame}
      onContinue={handleContinue}
    />
  );
}

export const Route = createFileRoute('/')({
  component: TitleRoute,
});
