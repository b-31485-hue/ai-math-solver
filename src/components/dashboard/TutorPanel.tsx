import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Send, Sparkles } from "lucide-react";
import { MathLatex } from "@/components/math/MathLatex";
import { TUTOR_QUICK_PROMPTS } from "@/lib/tutor-engine";
import type { TutorMessage } from "@/lib/tutor-engine";
import { cn } from "@/lib/utils";

export function TutorPanel({
  messages,
  input,
  setInput,
  onSend,
  onAsk,
  thinking = false,
  suggestions = [],
  compact = false,
}: {
  messages: TutorMessage[];
  input: string;
  setInput: (v: string) => void;
  onSend: () => void;
  onAsk?: (text: string) => void;
  thinking?: boolean;
  suggestions?: readonly string[];
  compact?: boolean;
}) {
  const endRef = useRef<HTMLDivElement>(null);
  const ask = onAsk ?? ((t: string) => setInput(t));

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  return (
    <div className={cn("h-full flex flex-col", compact ? "p-4" : "p-5 sm:p-6")}>
      <div className="flex items-center justify-between pb-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div
            className="grid h-9 w-9 place-items-center rounded-lg"
            style={{
              background: "var(--gradient-primary)",
              boxShadow: "var(--shadow-glow-sm)",
            }}
          >
            <BookOpen className="h-4 w-4 text-primary-foreground" strokeWidth={2} />
          </div>
          <div>
            <div className="text-sm font-semibold tracking-[-0.02em]">Calculus Tutor</div>
            <div className="text-xs text-muted-foreground mt-0.5">
              Rule-based · offline · free
            </div>
          </div>
        </div>
        <span className="badge-accent text-[10px]">Free</span>
      </div>

      <div className={cn("flex-1 overflow-y-auto space-y-3 py-5 pr-1", compact && "text-sm")}>
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <TutorBubble key={i} message={m} />
          ))}
        </AnimatePresence>

        {thinking && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2"
          >
            <div
              className="h-7 w-7 shrink-0 rounded-full"
              style={{ background: "var(--gradient-primary)" }}
            />
            <div className="surface rounded-2xl rounded-bl-md px-3.5 py-2.5 flex gap-1.5 items-center">
              {[0, 0.15, 0.3].map((d) => (
                <motion.span
                  key={d}
                  className="h-1.5 w-1.5 rounded-full bg-foreground/40"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1.1, delay: d, repeat: Infinity }}
                />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={endRef} />
      </div>

      {suggestions.length > 0 && messages.length < 6 && (
        <div className="flex flex-wrap gap-1.5 pb-3">
          {suggestions.slice(0, 4).map((s) => (
            <motion.button
              key={s}
              type="button"
              onClick={() => ask(s)}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="badge hover:bg-white/[0.06] hover:text-foreground transition-colors"
            >
              {s}
            </motion.button>
          ))}
        </div>
      )}

      <div className="pt-4 border-t border-white/[0.06]">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {TUTOR_QUICK_PROMPTS.map((s) => (
            <motion.button
              key={s}
              type="button"
              onClick={() => ask(s)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="badge-accent text-[11px]"
            >
              {s}
            </motion.button>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-black/40 focus-within:border-white/[0.15] focus-within:ring-2 focus-within:ring-white/[0.06] transition-all px-3 py-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !thinking && onSend()}
            placeholder="Ask about a rule or concept…"
            className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-muted-foreground/60"
            disabled={thinking}
          />
          <motion.button
            type="button"
            onClick={onSend}
            disabled={thinking}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            className="grid h-8 w-8 place-items-center rounded-lg text-primary-foreground disabled:opacity-40"
            style={{
              background: "var(--gradient-primary)",
              boxShadow: "var(--shadow-glow-sm)",
            }}
          >
            <Send className="h-3.5 w-3.5" strokeWidth={2} />
          </motion.button>
        </div>
      </div>
    </div>
  );
}

function TutorBubble({ message: m }: { message: TutorMessage }) {
  const isUser = m.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={cn("flex gap-2.5", isUser && "justify-end")}
    >
      {!isUser && (
        <div
          className="h-7 w-7 shrink-0 rounded-full mt-0.5"
          style={{ background: "var(--gradient-primary)" }}
        />
      )}
      <div
        className={cn(
          "max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
          isUser
            ? "rounded-br-md border border-white/[0.1] bg-white/[0.06] text-foreground"
            : "rounded-bl-md surface text-foreground/95",
        )}
      >
        {!isUser && m.rule && (
          <span className="badge-accent mb-2 inline-flex text-[10px]">
            <Sparkles className="h-2.5 w-2.5" />
            {m.rule}
          </span>
        )}
        <p>{m.text}</p>
        {m.latex && (
          <div className="mt-2.5 rounded-lg border border-white/[0.06] bg-black/35 px-3 py-2 overflow-x-auto">
            <MathLatex tex={m.latex} displayMode={!!m.tips?.length} size="sm" />
          </div>
        )}
        {!isUser && m.tips && m.tips.length > 0 && (
          <ul className="mt-2.5 space-y-1 text-xs text-muted-foreground list-disc pl-4">
            {m.tips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
}
