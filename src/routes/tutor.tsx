import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { TutorPanel } from "@/components/dashboard";
import { Reveal } from "@/components/motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useCalculusTutor } from "@/hooks/use-calculus-tutor";

export const Route = createFileRoute("/tutor")({
  head: () => ({
    meta: [
      { title: "Calculus Tutor — Calculus.ai" },
      {
        name: "description",
        content:
          "Learn differentiation and integration with a free, rule-based calculus tutor. Beginner-friendly explanations, no API required.",
      },
    ],
  }),
  component: TutorPage,
});

function TutorPage() {
  const tutor = useCalculusTutor({ thinkMs: 650 });

  return (
    <main className="container-saas pb-16 sm:pb-24 max-w-4xl">
      <Reveal className="text-center mb-10 sm:mb-12">
        <span className="badge mb-6">
          <BookOpen className="h-3.5 w-3.5" /> Calculus Tutor
        </span>
        <SectionHeader
          align="center"
          title={
            <>
              Learn <span className="gradient-text">differentiation</span> &{" "}
              <span className="gradient-text">integration</span>
            </>
          }
          description="Patient, rule-based lessons built into the app — no paid API, no account. Ask about power rule, +C, chain rule, trig, and more."
        />
      </Reveal>

      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="surface-elevated overflow-hidden h-[min(720px,calc(100vh-13rem))]"
      >
        <TutorPanel
          messages={tutor.messages}
          input={tutor.input}
          setInput={tutor.setInput}
          onSend={tutor.send}
          onAsk={tutor.ask}
          thinking={tutor.thinking}
          suggestions={tutor.suggestions}
        />
      </motion.div>
    </main>
  );
}
