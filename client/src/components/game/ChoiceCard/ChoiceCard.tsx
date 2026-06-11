import './ChoiceCard.css';

export type ChoiceKind =
  | 'ask'
  | 'reflect'
  | 'defy'
  | 'offer'
  | 'silence'
  | 'vow'
  | 'name'
  | 'ritual';

export type ChoiceState =
  | 'default'
  | 'selected'
  | 'disabled'
  | 'locked'
  | 'vowAligned'
  | 'vowWarning'
  | 'danger'
  | 'corrupted';

export type ChoiceCardProps = {
  kind: ChoiceKind;
  text: string;
  description?: string;
  state?: ChoiceState;
  requirement?: string;
  selected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
};

const choiceLabels: Record<ChoiceKind, string> = {
  ask: 'Ask',
  reflect: 'Reflect',
  defy: 'Defy',
  offer: 'Offer',
  silence: 'Silence',
  vow: 'Vow',
  name: 'Name',
  ritual: 'Ritual',
};

const choiceIcons: Record<ChoiceKind, string> = {
  ask: '?',
  reflect: '◉',
  defy: 'ϟ',
  offer: '◇',
  silence: '…',
  vow: '✦',
  name: '⌁',
  ritual: '⌬',
};

export function ChoiceCard({
  kind,
  text,
  description,
  state = 'default',
  requirement,
  selected = false,
  disabled = false,
  onClick,
}: ChoiceCardProps) {
  const effectiveState = selected ? 'selected' : state;
  const isDisabled = disabled || state === 'disabled' || state === 'locked';

  return (
    <button
      className="he-choice-card"
      type="button"
      data-kind={kind}
      data-state={effectiveState}
      disabled={isDisabled}
      onClick={onClick}
    >
      <span className="he-choice-card__icon" aria-hidden="true">
        {choiceIcons[kind]}
      </span>

      <span className="he-choice-card__content">
        <span className="he-choice-card__label">{choiceLabels[kind]}</span>
        <span className="he-choice-card__text">{text}</span>

        {description && (
          <span className="he-choice-card__description">{description}</span>
        )}

        {requirement && (
          <span className="he-choice-card__requirement">{requirement}</span>
        )}
      </span>
    </button>
  );
}
