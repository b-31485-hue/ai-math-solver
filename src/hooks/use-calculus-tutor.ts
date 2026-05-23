import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  askTutor,
  getWelcomeMessage,
  getSuggestionsForMode,
  type TutorContext,
  type TutorMessage,
  type TutorReply,
} from "@/lib/tutor-engine";

interface UseCalculusTutorOptions extends TutorContext {
  /** Simulate brief thinking delay (ms) for natural feel */
  thinkMs?: number;
}

export function useCalculusTutor({
  expr,
  mode,
  detectedRules,
  thinkMs = 550,
}: UseCalculusTutorOptions = {}) {
  const [messages, setMessages] = useState<TutorMessage[]>(() => {
    const welcome = getWelcomeMessage(mode);
    return [replyToMessage(welcome)];
  });
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const requestId = useRef(0);

  const context = useMemo(
    () => ({ expr, mode, detectedRules }),
    [expr, mode, detectedRules],
  );

  // Refresh greeting when mode changes significantly
  useEffect(() => {
    setMessages((prev) => {
      if (prev.length > 2) return prev;
      return [replyToMessage(getWelcomeMessage(mode))];
    });
  }, [mode]);

  const ask = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const id = ++requestId.current;
      setMessages((m) => [...m, { role: "user", text: trimmed }]);
      setInput("");
      setThinking(true);

      window.setTimeout(() => {
        if (id !== requestId.current) return;
        const reply = askTutor(trimmed, context);
        setMessages((m) => [...m, replyToMessage(reply)]);
        setThinking(false);
      }, thinkMs);
    },
    [context, thinkMs],
  );

  const send = useCallback(() => ask(input), [ask, input]);

  const suggestions = getSuggestionsForMode(mode);

  return {
    messages,
    input,
    setInput,
    thinking,
    ask,
    send,
    suggestions,
    clearInput: () => setInput(""),
  };
}

function replyToMessage(reply: TutorReply): TutorMessage {
  return {
    role: "ai",
    text: reply.text,
    latex: reply.latex,
    rule: reply.rule,
    tips: reply.tips,
  };
}
