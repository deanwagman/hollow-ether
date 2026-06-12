import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { IntroChoiceCard } from '../../cinematic/IntroChoiceCard';
import { TerminalSequence } from '../../cinematic/TerminalSequence';
import './IntroTutorialScreen.css';

export type IntroTutorialScreenProps = {
  onComplete?: () => void;
};

type IntroTutorialBeat =
  | 'terminalBoot'
  | 'nameQuestion'
  | 'answerEcho'
  | 'clearBootTerminal'
  | 'answerResponse'
  | 'ended';

type IntroNameAnswer =
  | 'yes'
  | 'no'
  | 'pieces'
  | 'who_is_asking'
  | 'silence';

type IntroNameChoice = {
  id: IntroNameAnswer;
  label: string;
  eyebrow: string;
  tone: 'default' | 'signal' | 'memory' | 'warning' | 'silence';
};

const INTRO_TERMINAL_LINES = [
  { text: 'signal found', holdMs: 700, deleteAfter: true },
  { text: 'source: below', holdMs: 700, deleteAfter: true },
  { text: 'breath: unnecessary', holdMs: 900, deleteAfter: true },
  { text: 'name: unstable', holdMs: 1200, deleteAfter: false },
];

const NAME_CHOICES: IntroNameChoice[] = [
  {
    id: 'yes',
    label: 'Yes.',
    eyebrow: 'Answer',
    tone: 'default',
  },
  {
    id: 'no',
    label: 'No.',
    eyebrow: 'Answer',
    tone: 'warning',
  },
  {
    id: 'pieces',
    label: 'I remember pieces.',
    eyebrow: 'Memory',
    tone: 'memory',
  },
  {
    id: 'who_is_asking',
    label: 'Who is asking?',
    eyebrow: 'Query',
    tone: 'signal',
  },
  {
    id: 'silence',
    label: 'Remain silent.',
    eyebrow: 'Silence',
    tone: 'silence',
  },
];

const NAME_RESPONSE_LINES: Record<
  IntroNameAnswer,
  Array<{ text: string; holdMs?: number; deleteAfter?: boolean }>
> = {
  yes: [
    { text: 'answer recorded', holdMs: 450, deleteAfter: true },
    { text: 'name held', holdMs: 650, deleteAfter: true },
    {
      text: 'warning: names attract attention',
      holdMs: 1100,
      deleteAfter: false,
    },
  ],
  no: [
    { text: 'answer recorded', holdMs: 450, deleteAfter: true },
    { text: 'name absent', holdMs: 650, deleteAfter: true },
    {
      text: 'warning: absence is also a shape',
      holdMs: 1100,
      deleteAfter: false,
    },
  ],
  pieces: [
    { text: 'answer recorded', holdMs: 450, deleteAfter: true },
    { text: 'partial name echo detected', holdMs: 800, deleteAfter: true },
    {
      text: 'warning: fragments may answer for you',
      holdMs: 1200,
      deleteAfter: false,
    },
  ],
  who_is_asking: [
    { text: 'query returned', holdMs: 650, deleteAfter: true },
    {
      text: 'speaker: not yet safe to name',
      holdMs: 1200,
      deleteAfter: false,
    },
  ],
  silence: [
    { text: 'silence detected', holdMs: 650, deleteAfter: true },
    {
      text: 'warning: silence is not empty here',
      holdMs: 1200,
      deleteAfter: false,
    },
  ],
};

const NAME_ANSWER_ECHO: Record<IntroNameAnswer, string> = {
  yes: 'yes',
  no: 'no',
  pieces: 'i remember pieces',
  who_is_asking: 'who is asking?',
  silence: '...',
};

const questionVariants = {
  hidden: {
    opacity: 0,
    y: 10,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: 'blur(8px)',
    transition: {
      duration: 0.25,
    },
  },
};

const choiceListVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.18,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.04,
      staggerDirection: -1,
    },
  },
};

const choiceItemVariants = {
  hidden: {
    opacity: 0,
    y: 12,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.42,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    filter: 'blur(8px)',
    transition: {
      duration: 0.22,
    },
  },
};

const echoVariants = {
  hidden: {
    opacity: 0,
    y: 8,
    filter: 'blur(6px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    filter: 'blur(6px)',
    transition: {
      duration: 0.25,
    },
  },
};

const bootTerminalVariants = {
  hidden: {
    opacity: 0,
    y: 8,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: 'blur(10px)',
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const responseVariants = {
  hidden: {
    opacity: 0,
    y: 8,
    filter: 'blur(8px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    filter: 'blur(8px)',
    transition: {
      duration: 0.25,
    },
  },
};

export function IntroTutorialScreen(_props: IntroTutorialScreenProps) {
  const [beat, setBeat] = useState<IntroTutorialBeat>('terminalBoot');
  const [selectedAnswer, setSelectedAnswer] = useState<IntroNameAnswer | null>(
    null,
  );
  const answerEchoTimeoutRef = useRef<number | null>(null);
  const clearBootTimeoutRef = useRef<number | null>(null);

  const responseLines = useMemo(() => {
    if (!selectedAnswer) return [];
    return NAME_RESPONSE_LINES[selectedAnswer];
  }, [selectedAnswer]);

  const showBootTerminal =
    beat === 'terminalBoot' ||
    beat === 'nameQuestion' ||
    beat === 'answerEcho' ||
    beat === 'clearBootTerminal';

  const showQuestion = beat === 'nameQuestion';
  const showAnswerEcho =
    beat === 'answerEcho' || beat === 'clearBootTerminal';
  const showAnswerResponse = beat === 'answerResponse' || beat === 'ended';
  const showChoices = beat === 'nameQuestion';

  const handleTerminalComplete = useCallback(() => {
    setBeat('nameQuestion');
  }, []);

  const handleSelectAnswer = useCallback((answer: IntroNameAnswer) => {
    setSelectedAnswer(answer);
    setBeat('answerEcho');

    if (answerEchoTimeoutRef.current) {
      window.clearTimeout(answerEchoTimeoutRef.current);
    }

    if (clearBootTimeoutRef.current) {
      window.clearTimeout(clearBootTimeoutRef.current);
    }

    answerEchoTimeoutRef.current = window.setTimeout(() => {
      setBeat('clearBootTerminal');

      clearBootTimeoutRef.current = window.setTimeout(() => {
        setBeat('answerResponse');
      }, 530);
    }, 700);
  }, []);

  const handleResponseComplete = useCallback(() => {
    setBeat('ended');
  }, []);

  useEffect(() => {
    return () => {
      if (answerEchoTimeoutRef.current) {
        window.clearTimeout(answerEchoTimeoutRef.current);
      }

      if (clearBootTimeoutRef.current) {
        window.clearTimeout(clearBootTimeoutRef.current);
      }
    };
  }, []);

  return (
    <main className="he-intro-tutorial-screen">
      <div className="he-intro-tutorial-screen__noise" aria-hidden="true" />
      <div className="he-intro-tutorial-screen__scanline" aria-hidden="true" />

      <section
        className="he-intro-tutorial-screen__content"
        aria-label="Intro tutorial"
      >
        <div className="he-intro-tutorial-screen__terminal-stage">
          <AnimatePresence mode="wait">
            {showBootTerminal && (
              <motion.div
                key="boot-terminal"
                variants={bootTerminalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <TerminalSequence
                  lines={INTRO_TERMINAL_LINES}
                  onComplete={handleTerminalComplete}
                />
              </motion.div>
            )}

            {showAnswerResponse && selectedAnswer && (
              <motion.div
                key="answer-response"
                variants={responseVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <TerminalSequence
                  lines={responseLines}
                  cursorBlinkCount={1}
                  typingSpeedMs={54}
                  deletingSpeedMs={28}
                  startDelayMs={180}
                  onComplete={handleResponseComplete}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="he-intro-tutorial-screen__interaction-stage">
          <AnimatePresence mode="wait">
            {showQuestion && (
              <motion.div
                key="name-question"
                className="he-intro-tutorial-screen__question"
                variants={questionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                do you remember it?
              </motion.div>
            )}

            {showAnswerEcho && selectedAnswer && (
              <motion.div
                key="answer-echo"
                className="he-intro-tutorial-screen__echo"
                variants={echoVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <span aria-hidden="true">{'>'}</span>
                <span>{NAME_ANSWER_ECHO[selectedAnswer]}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="he-intro-tutorial-screen__choices-stage">
          <AnimatePresence mode="wait">
            {showChoices && (
              <motion.div
                key="name-choices"
                className="he-intro-tutorial-screen__choices"
                variants={choiceListVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {NAME_CHOICES.map((choice) => (
                  <motion.div key={choice.id} variants={choiceItemVariants}>
                    <IntroChoiceCard
                      label={choice.label}
                      eyebrow={choice.eyebrow}
                      tone={choice.tone}
                      selected={selectedAnswer === choice.id}
                      disabled={Boolean(selectedAnswer)}
                      onClick={() => handleSelectAnswer(choice.id)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}
