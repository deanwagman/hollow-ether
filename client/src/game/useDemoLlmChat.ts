import { useMutation } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import type { DemoChatMessage } from '../lib/demoLlmApi';
import { sendDemoChat } from '../lib/demoLlmApi';
import type { NarrativeLine } from './types';

function nextMessageId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function toHistory(messages: NarrativeLine[]): DemoChatMessage[] {
  return messages.map((m) => ({
    role: m.speaker === 'player' ? 'user' : 'assistant',
    content: m.text,
  }));
}

function playerLine(text: string): NarrativeLine {
  return { id: nextMessageId(), speaker: 'player', text };
}

function assistantLine(text: string): NarrativeLine {
  return { id: nextMessageId(), speaker: 'luminia', text };
}

type SendVars = {
  text: string;
  priorMessages: NarrativeLine[];
};

export function useDemoLlmChat() {
  const [messages, setMessages] = useState<NarrativeLine[]>([]);

  const mutation = useMutation({
    mutationFn: ({ text, priorMessages }: SendVars) =>
      sendDemoChat(text, toHistory(priorMessages)),
    onMutate: ({ text, priorMessages }) => {
      setMessages([...priorMessages, playerLine(text)]);
    },
    onSuccess: (data) => {
      setMessages((current) => [...current, assistantLine(data.reply)]);
    },
  });

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || mutation.isPending) return;
      mutation.mutate({ text: trimmed, priorMessages: messages });
    },
    [messages, mutation],
  );

  return {
    messages,
    send,
    isPending: mutation.isPending,
    isError: mutation.isError,
  };
}
