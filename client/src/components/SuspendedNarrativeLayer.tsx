import { ReactNode } from 'react';
import NarrativePanel from './NarrativePanel';
import type { NarrativeLine } from '../game/types';

type SuspendedNarrativeLayerProps = {
  messages: NarrativeLine[];
  isLoading?: boolean;
  isListening?: boolean;
  isError?: boolean;
  errorContent?: ReactNode;
  sceneKey: string;
};

export default function SuspendedNarrativeLayer({
  messages,
  isLoading,
  isListening,
  isError,
  errorContent,
  sceneKey,
}: SuspendedNarrativeLayerProps) {
  return (
    <div key={sceneKey} className="suspended-narrative-layer">
      {isError ? (
        <div className="suspended-narrative-layer__dialogue narrative-panel--status">
          {errorContent}
        </div>
      ) : (
        <NarrativePanel
          messages={messages}
          isLoading={isLoading}
          isListening={isListening}
          variant="embedded"
        />
      )}
    </div>
  );
}
