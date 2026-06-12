import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { TerminalSequence } from '../../cinematic/TerminalSequence';
import { Button } from '../../primitives/Button/Button';
import './IntroTutorialScreen.css';

export type IntroTutorialScreenProps = {
  onComplete?: () => void;
};

const INTRO_TERMINAL_LINES = [
  { text: 'signal found', holdMs: 700, deleteAfter: true },
  { text: 'source: below', holdMs: 700, deleteAfter: true },
  { text: 'breath: unnecessary', holdMs: 900, deleteAfter: true },
  { text: 'name: unstable', holdMs: 1200, deleteAfter: false },
];

const continueVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      delay: 1,
      duration: 1.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
};

export function IntroTutorialScreen({ onComplete }: IntroTutorialScreenProps) {
  const [terminalComplete, setTerminalComplete] = useState(false);

  const handleTerminalComplete = useCallback(() => {
    setTerminalComplete(true);
  }, []);

  return (
    <main className="he-intro-tutorial-screen">
      <div className="he-intro-tutorial-screen__noise" aria-hidden="true" />
      <div className="he-intro-tutorial-screen__scanline" aria-hidden="true" />

      <section
        className="he-intro-tutorial-screen__content"
        aria-label="Intro tutorial"
      >
        <div className="he-intro-tutorial-screen__terminal">
          <TerminalSequence
            lines={INTRO_TERMINAL_LINES}
            onComplete={handleTerminalComplete}
          />
        </div>

        <div className="he-intro-tutorial-screen__continue-stage">
          <AnimatePresence>
            {terminalComplete && (
              <motion.div
                className="he-intro-tutorial-screen__continue"
                variants={continueVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <p className="he-intro-tutorial-screen__hint">
                  The dark has found enough of you to continue.
                </p>

                <Button variant="primary" size="lg" onClick={onComplete}>
                  Continue
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}
