import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { CinematicTextRevealLine } from '../../cinematic/CinematicTextReveal';
import { CinematicTextReveal } from '../../cinematic/CinematicTextReveal';
import { IntroChoiceCard } from '../../cinematic/IntroChoiceCard';
import { TerminalFontGlitch } from '../../cinematic/TerminalFontGlitch';
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
  | 'terminalToProse'
  | 'awakeningProse'
  | 'auralithEntrance'
  | 'auralithFirstLine'
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

const BOOT_TERMINAL_LINES = [
  { text: 'signal found', holdMs: 1400, deleteAfter: true },
  { text: 'source: below', holdMs: 1400, deleteAfter: true },
  { text: 'breath: unnecessary', holdMs: 1800, deleteAfter: true },
  { text: 'name: unstable', holdMs: 2400, deleteAfter: false },
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
    { text: 'answer recorded', holdMs: 900, deleteAfter: true },
    { text: 'name held', holdMs: 1300, deleteAfter: true },
    {
      text: 'warning: names attract attention',
      holdMs: 2200,
      deleteAfter: false,
    },
  ],
  no: [
    { text: 'answer recorded', holdMs: 900, deleteAfter: true },
    { text: 'name absent', holdMs: 1300, deleteAfter: true },
    {
      text: 'warning: absence is also a shape',
      holdMs: 2200,
      deleteAfter: false,
    },
  ],
  pieces: [
    { text: 'answer recorded', holdMs: 900, deleteAfter: true },
    { text: 'partial name echo detected', holdMs: 1600, deleteAfter: true },
    {
      text: 'warning: fragments may answer for you',
      holdMs: 2400,
      deleteAfter: false,
    },
  ],
  who_is_asking: [
    { text: 'query returned', holdMs: 1300, deleteAfter: true },
    {
      text: 'speaker: not yet safe to name',
      holdMs: 2400,
      deleteAfter: false,
    },
  ],
  silence: [
    { text: 'silence detected', holdMs: 1300, deleteAfter: true },
    {
      text: 'warning: silence is not empty here',
      holdMs: 2400,
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

const FINAL_RESPONSE_TEXT: Record<IntroNameAnswer, string> = {
  yes: 'warning: names attract attention',
  no: 'warning: absence is also a shape',
  pieces: 'warning: fragments may answer for you',
  who_is_asking: 'speaker: not yet safe to name',
  silence: 'warning: silence is not empty here',
};

const FINAL_RESPONSE_CORRUPTED_TEXT: Record<IntroNameAnswer, string> = {
  yes: 'w_rning: n_mes attr_ct attent_on',
  no: 'w_rning: abs_nce is als_ a sh_pe',
  pieces: 'w_rning: fr_gments may ans_er f_r y_u',
  who_is_asking: 'sp_aker: n_t y_t safe t_ name',
  silence: 'w_rning: sil_nce is n_t empty h_re',
};

const AWAKENING_PROSE_LINES: CinematicTextRevealLine[] = [
  { text: 'You wake beneath the stars.' },
  { text: 'Not under them.', emphasis: true, delayAfterMs: 2050 },
  { text: 'Beneath them.', emphasis: true, delayAfterMs: 2050 },
  {
    text: 'The constellations ripple above you like fish seen through black water.',
    delayAfterMs: 3750,
  },
  { text: 'Your lungs do not ask for air.' },
  { text: 'Your hands are full of light you do not remember stealing.' },
];

const AURALITH_ENTRANCE_LINES: CinematicTextRevealLine[] = [
  { text: 'A pale figure gathers itself from the cursor.' },
  { text: 'Not a woman.', emphasis: true },
  { text: 'Not a star.', emphasis: true },
  { text: 'Not a warning.', emphasis: true },
  { text: 'Something trying to be gentle.', delayAfterMs: 3750 },
];

const AURALITH_REACTIVE_LINES: Record<IntroNameAnswer, string> = {
  yes: 'You answered as if a name were a thing one owns.',
  no: 'You answered honestly. That is rarer here than safety.',
  pieces: 'Pieces are how most true things survive the descent.',
  who_is_asking: 'You asked the safest question first.',
  silence: 'You left room for the dark to answer.',
};

function getAuralithFirstLines(answer: IntroNameAnswer): CinematicTextRevealLine[] {
  return [
    { text: AURALITH_REACTIVE_LINES[answer] },
    { text: '“I am Auralith,” she says.', emphasis: true },
    {
      text: '“The first glow is not always safe. But it is usually kind.”',
      delayAfterMs: 4375,
    },
  ];
}

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

const terminalLayerVariants = {
  hidden: {
    opacity: 0,
    filter: 'blur(4px)',
  },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.32,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    filter: 'blur(4px)',
    transition: {
      duration: 0.24,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const terminalGlitchLayerVariants = {
  hidden: {
    opacity: 1,
    filter: 'blur(0px)',
  },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
  },
  exit: {
    opacity: 0,
    filter: 'blur(2px)',
    transition: {
      duration: 0.12,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const proseRevealVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as const,
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

  const auralithFirstLines = useMemo(() => {
    if (!selectedAnswer) return [];
    return getAuralithFirstLines(selectedAnswer);
  }, [selectedAnswer]);

  const isProseMode =
    beat === 'awakeningProse' ||
    beat === 'auralithEntrance' ||
    beat === 'auralithFirstLine' ||
    beat === 'ended';

  const showBootTerminal =
    beat === 'terminalBoot' ||
    beat === 'nameQuestion' ||
    beat === 'answerEcho' ||
    beat === 'clearBootTerminal';

  const showQuestion = beat === 'nameQuestion';
  const showAnswerEcho =
    beat === 'answerEcho' ||
    beat === 'clearBootTerminal' ||
    beat === 'answerResponse';
  const showAnswerResponse = beat === 'answerResponse';
  const showChoices = beat === 'nameQuestion';
  const showTerminalGlitch = beat === 'terminalToProse';
  const showAwakeningProse = beat === 'awakeningProse';
  const showAuralithEntrance = beat === 'auralithEntrance';
  const showAuralithFirstLine =
    beat === 'auralithFirstLine' || beat === 'ended';

  const hasAnswered = selectedAnswer !== null;

  const shouldCollapseInteraction =
    beat === 'terminalToProse' ||
    beat === 'awakeningProse' ||
    beat === 'auralithEntrance' ||
    beat === 'auralithFirstLine' ||
    beat === 'ended';

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

  const handleAnswerResponseComplete = useCallback(() => {
    setBeat('terminalToProse');
  }, []);

  const handleTerminalGlitchComplete = useCallback(() => {
    setBeat('awakeningProse');
  }, []);

  const handleAwakeningProseComplete = useCallback(() => {
    setBeat('auralithEntrance');
  }, []);

  const handleAuralithEntranceComplete = useCallback(() => {
    setBeat('auralithFirstLine');
  }, []);

  const handleAuralithFirstLineComplete = useCallback(() => {
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
    <main
      className="he-intro-tutorial-screen"
      data-mode={isProseMode ? 'prose' : 'terminal'}
    >
      <div className="he-intro-tutorial-screen__noise" aria-hidden="true" />
      <div className="he-intro-tutorial-screen__scanline" aria-hidden="true" />

      <section
        className="he-intro-tutorial-screen__content"
        aria-label="Intro tutorial"
      >
        <div className="he-intro-tutorial-screen__terminal-stage">
          <div className="he-intro-tutorial-screen__terminal-slot">
            <AnimatePresence mode="sync">
              {showBootTerminal && (
                <motion.div
                  key="boot-terminal"
                  className="he-intro-tutorial-screen__terminal-layer"
                  variants={terminalLayerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <TerminalSequence
                    lines={BOOT_TERMINAL_LINES}
                    cursorBlinkCount={3}
                    typingSpeedMs={108}
                    deletingSpeedMs={56}
                    startDelayMs={250}
                    onComplete={handleTerminalComplete}
                  />
                </motion.div>
              )}

              {showAnswerResponse && selectedAnswer && (
                <motion.div
                  key="answer-response"
                  className="he-intro-tutorial-screen__terminal-layer"
                  variants={terminalLayerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <TerminalSequence
                    lines={responseLines}
                    cursorBlinkCount={1}
                    typingSpeedMs={108}
                    deletingSpeedMs={56}
                    startDelayMs={180}
                    onComplete={handleAnswerResponseComplete}
                  />
                </motion.div>
              )}

              {showTerminalGlitch && selectedAnswer && (
                <motion.div
                  key="terminal-glitch"
                  className="he-intro-tutorial-screen__terminal-layer"
                  variants={terminalGlitchLayerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <TerminalFontGlitch
                    text={FINAL_RESPONSE_TEXT[selectedAnswer]}
                    corruptedText={
                      FINAL_RESPONSE_CORRUPTED_TEXT[selectedAnswer]
                    }
                    intensity="medium"
                    durationMs={1600}
                    fadeOutMs={500}
                    onComplete={handleTerminalGlitchComplete}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div
          className="he-intro-tutorial-screen__interaction-stage"
          data-collapsed={shouldCollapseInteraction || undefined}
        >
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
                className="he-intro-tutorial-screen__answer-echo"
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

        <div
          className="he-intro-tutorial-screen__choices-stage"
          data-collapsed={hasAnswered || undefined}
        >
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

        <div className="he-intro-tutorial-screen__prose-stage">
          <AnimatePresence mode="wait">
            {showAwakeningProse && (
              <motion.div
                key="awakening-prose"
                className="he-intro-tutorial-screen__prose-reveal"
                variants={proseRevealVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <CinematicTextReveal
                  tone="prose"
                  lines={AWAKENING_PROSE_LINES}
                  onComplete={handleAwakeningProseComplete}
                />
              </motion.div>
            )}

            {showAuralithEntrance && (
              <motion.div
                key="auralith-entrance"
                className="he-intro-tutorial-screen__prose-reveal"
                variants={proseRevealVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <CinematicTextReveal
                  tone="spirit"
                  lineDelayMs={2813}
                  lines={AURALITH_ENTRANCE_LINES}
                  onComplete={handleAuralithEntranceComplete}
                />
              </motion.div>
            )}

            {showAuralithFirstLine && selectedAnswer && (
              <motion.div
                key="auralith-first-line"
                className="he-intro-tutorial-screen__prose-reveal"
                variants={proseRevealVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <CinematicTextReveal
                  tone="spirit"
                  lineDelayMs={3281}
                  lines={auralithFirstLines}
                  onComplete={handleAuralithFirstLineComplete}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}
