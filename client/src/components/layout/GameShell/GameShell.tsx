import type { ReactNode } from 'react';
import './GameShell.css';

export type GameShellSection = 'recall' | 'spirits' | 'vows' | 'options' | 'map';

export type GameShellProps = {
  leftSidebar: ReactNode;
  children: ReactNode;
  rightInspector?: ReactNode;
  activeSection?: GameShellSection;
  onNavigate?: (section: GameShellSection) => void;
  className?: string;
};

const navItems: Array<{
  id: GameShellSection;
  label: string;
  description: string;
  icon: string;
}> = [
  {
    id: 'recall',
    label: 'Recall',
    description: 'Memories',
    icon: '◎',
  },
  {
    id: 'spirits',
    label: 'Spirits',
    description: 'Compendium',
    icon: '♁',
  },
  {
    id: 'vows',
    label: 'Vows',
    description: 'Your Word',
    icon: '✦',
  },
  {
    id: 'options',
    label: 'Options',
    description: 'Settings',
    icon: '⚙',
  },
  {
    id: 'map',
    label: 'Map',
    description: 'The Wake Layer',
    icon: '✧',
  },
];

const leftNavItems = navItems.slice(0, 2);
const rightNavItems = navItems.slice(2);

function NavButton({
  item,
  isActive,
  onNavigate,
}: {
  item: (typeof navItems)[number];
  isActive: boolean;
  onNavigate?: (section: GameShellSection) => void;
}) {
  return (
    <button
      type="button"
      className="he-game-shell__nav-button"
      data-section={item.id}
      aria-current={isActive ? 'page' : undefined}
      onClick={() => onNavigate?.(item.id)}
    >
      <span className="he-game-shell__nav-icon" aria-hidden="true">
        {item.icon}
      </span>
      <span className="he-game-shell__nav-text">
        <span className="he-game-shell__nav-label">{item.label}</span>
        <span className="he-game-shell__nav-description">
          {item.description}
        </span>
      </span>
    </button>
  );
}

export function GameShell({
  leftSidebar,
  children,
  rightInspector,
  activeSection = 'map',
  onNavigate,
  className,
}: GameShellProps) {
  const classes = ['he-game-shell', className].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <div className="he-game-shell__backdrop" aria-hidden="true" />

      <div className="he-game-shell__content">
        <aside className="he-game-shell__left" aria-label="Player status">
          {leftSidebar}
        </aside>

        <main className="he-game-shell__main">{children}</main>

        {rightInspector && (
          <aside className="he-game-shell__right" aria-label="Inspector">
            {rightInspector}
          </aside>
        )}
      </div>

      <nav className="he-game-shell__bottom-nav" aria-label="Game navigation">
        <div className="he-game-shell__nav-group he-game-shell__nav-group--left">
          {leftNavItems.map((item) => (
            <NavButton
              key={item.id}
              item={item}
              isActive={item.id === activeSection}
              onNavigate={onNavigate}
            />
          ))}
        </div>

        <div className="he-game-shell__nav-core" aria-hidden="true" />

        <div className="he-game-shell__nav-group he-game-shell__nav-group--right">
          {rightNavItems.map((item) => (
            <NavButton
              key={item.id}
              item={item}
              isActive={item.id === activeSection}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </nav>
    </div>
  );
}
