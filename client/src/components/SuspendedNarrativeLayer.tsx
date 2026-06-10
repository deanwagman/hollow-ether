import { ReactNode } from 'react';
import NarrativePanel from './NarrativePanel';
import type { NarrativeLine } from '../game/types';

type SuspendedNarrativeLayerProps = {
  messages: NarrativeLine[];
  sessionId: string;
  isLoading?: boolean;
  isListening?: boolean;
  isError?: boolean;
  errorContent?: ReactNode;
  onRevealingChange?: (revealing: boolean) => void;
};

export default function SuspendedNarrativeLayer({
  messages,
  sessionId,
  isLoading,
  isListening,
  isError,
  errorContent,
  onRevealingChange,
}: SuspendedNarrativeLayerProps) {
  return (
    <div className="suspended-narrative-layer">
      {isError ? (
        <div className="suspended-narrative-layer__dialogue narrative-panel--status">
          {errorContent}
        </div>
      ) : (
        <NarrativePanel
          key={sessionId || 'loading'}
          messages={messages}
          sessionId={sessionId}
          isLoading={isLoading}
          isListening={isListening}
          variant="embedded"
          onRevealingChange={onRevealingChange}
        />
      )}
    </div>
  );
}
