import { motion } from 'motion/react';
import { useReducedMotionPreference } from '../../../game/useReducedMotionPreference';
import { Button } from '../../primitives/Button/Button';
import './TitleScreen.css';

export type TitleScreenProps = {
  logoSrc?: string;
  hasContinue?: boolean;
  version?: string;
  subtitle?: string;
  audioStatus?: 'off' | 'loading' | 'on';
  onNewGame?: () => void;
  onContinue?: () => void;
  onSettings?: () => void;
  onCredits?: () => void;
};

const screenVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 2.7,
      ease: [0.22, 1, 0.36, 1] as const,
      when: 'beforeChildren' as const,
      staggerChildren: 0.36,
    },
  },
};

const logoVariants = {
  hidden: {
    opacity: 0,
    scale: 0.94,
    y: 12,
    filter: 'blur(18px)',
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 4.35,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

const subtitleVariants = {
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
      duration: 2.55,
      ease: [0.22, 1, 0.36, 1] as const,
      delay: 0.75,
    },
  },
};

const menuItemVariants = {
  hidden: {
    opacity: 0,
    y: 18,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 1.5,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

const footerVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 2.4,
      delay: 2.7,
    },
  },
};

export function TitleScreen({
  logoSrc = 'images/logo-transparent.png',
  hasContinue = false,
  version = 'prototype',
  subtitle = 'A ritual conversation beneath space and sea.',
  audioStatus = 'off',
  onNewGame,
  onContinue,
  onSettings,
  onCredits,
}: TitleScreenProps) {
  const reducedMotion = useReducedMotionPreference();

  return (
    <motion.main
      className="he-title-screen"
      initial={reducedMotion ? false : 'hidden'}
      animate="visible"
      variants={screenVariants}
    >
      <div className="he-title-screen__backdrop" aria-hidden="true">
        <div className="he-title-screen__beam" />
        <div className="he-title-screen__orb he-title-screen__orb--one" />
        <div className="he-title-screen__orb he-title-screen__orb--two" />
        <div className="he-title-screen__grid" />
      </div>

      <section
        className="he-title-screen__content"
        aria-labelledby="title-screen-heading"
      >
        <motion.div
          className="he-title-screen__logo-wrap"
          variants={logoVariants}
        >
          <img
            className="he-title-screen__logo"
            src={logoSrc}
            alt="Hollow Ether"
            draggable={false}
          />
        </motion.div>

        <motion.div
          className="he-title-screen__copy"
          variants={subtitleVariants}
        >
          <h1 id="title-screen-heading" className="he-title-screen__sr-title">
            Hollow Ether
          </h1>

          <p className="he-title-screen__subtitle">{subtitle}</p>
        </motion.div>

        <motion.nav
          className="he-title-screen__menu"
          aria-label="Main menu"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.33,
                delayChildren: 1.65,
              },
            },
          }}
        >
          <motion.div variants={menuItemVariants}>
            <Button variant="primary" size="lg" fullWidth onClick={onNewGame}>
              New Game
            </Button>
          </motion.div>

          <motion.div variants={menuItemVariants}>
            <Button
              variant="default"
              size="lg"
              fullWidth
              disabled={!hasContinue}
              onClick={onContinue}
            >
              Continue
            </Button>
          </motion.div>

          <motion.div variants={menuItemVariants}>
            <Button variant="ghost" size="md" fullWidth onClick={onSettings}>
              Settings
            </Button>
          </motion.div>

          <motion.div variants={menuItemVariants}>
            <Button variant="ghost" size="md" fullWidth onClick={onCredits}>
              Credits
            </Button>
          </motion.div>
        </motion.nav>
      </section>

      <motion.footer
        className="he-title-screen__footer"
        variants={footerVariants}
      >
        <span>Hollow Ether</span>
        <span className="he-title-screen__version">{version}</span>
        <span data-audio-status={audioStatus}>Audio: {audioStatus}</span>
      </motion.footer>
    </motion.main>
  );
}
