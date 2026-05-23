import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ChevronLeft, ChevronRight, History, Plus, Settings, Sigma } from "lucide-react";
import { WORKSPACE_HISTORY, WORKSPACE_NAV } from "@/config/navigation";
import { springNav } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function WorkspaceSidebar({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <motion.aside
      initial={false}
      animate={{ width: open ? 248 : 72 }}
      transition={{ type: "spring", stiffness: 280, damping: 32 }}
      className="hidden md:flex flex-col surface-elevated overflow-hidden shrink-0"
    >
      <div
        className={cn(
          "flex items-center border-b border-white/[0.06] p-3",
          open ? "justify-between" : "justify-center",
        )}
      >
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="brand"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              className="flex items-center gap-2.5 px-1"
            >
              <div
                className="grid h-7 w-7 place-items-center rounded-lg"
                style={{
                  background: "var(--gradient-primary)",
                  boxShadow: "var(--shadow-glow-sm)",
                }}
              >
                <Sigma className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={2.25} />
              </div>
              <span className="text-sm font-semibold tracking-[-0.02em]">Workspace</span>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setOpen(!open)}
          className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.05] transition-colors"
          aria-label="Toggle sidebar"
        >
          {open ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 p-2 space-y-0.5">
        {WORKSPACE_NAV.map((item) => {
          const active = pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors",
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]",
              )}
            >
              {active && (
                <motion.span
                  layoutId="dash-pill"
                  className="absolute inset-0 rounded-lg bg-white/[0.06] border border-white/[0.08]"
                  transition={springNav}
                />
              )}
              <item.icon className="relative h-4 w-4 shrink-0" strokeWidth={1.75} />
              <AnimatePresence initial={false}>
                {open && (
                  <motion.span
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    className="relative whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}

        {open && (
          <div className="pt-5">
            <div className="px-3 mb-2 flex items-center justify-between">
              <span className="eyebrow !text-[10px] !text-muted-foreground">History</span>
              <History className="h-3 w-3 text-muted-foreground" />
            </div>
            <ul className="space-y-0.5">
              {WORKSPACE_HISTORY.map((h, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <button
                    type="button"
                    className="w-full text-left flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-xs hover:bg-white/[0.04] transition-colors group"
                  >
                    <span className="truncate font-mono text-foreground/75 group-hover:text-foreground">
                      {h.label}
                    </span>
                    <span className="badge text-[10px] shrink-0">{h.mode}</span>
                  </button>
                </motion.li>
              ))}
            </ul>
          </div>
        )}
      </nav>

      <div className="p-2 border-t border-white/[0.06] space-y-0.5">
        <button
          type="button"
          className={cn(
            "flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-[13px] font-medium text-primary-foreground",
            !open && "justify-center",
          )}
          style={{
            background: "var(--gradient-primary)",
            boxShadow: "var(--shadow-glow-sm)",
          }}
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          {open && <span>New session</span>}
        </button>
        <button
          type="button"
          className={cn(
            "flex items-center gap-3 w-full rounded-lg px-3 py-2 text-[13px] text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-colors",
            !open && "justify-center",
          )}
        >
          <BookOpen className="h-4 w-4" strokeWidth={1.75} />
          {open && <span>Docs</span>}
        </button>
        <button
          type="button"
          className={cn(
            "flex items-center gap-3 w-full rounded-lg px-3 py-2 text-[13px] text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-colors",
            !open && "justify-center",
          )}
        >
          <Settings className="h-4 w-4" strokeWidth={1.75} />
          {open && <span>Settings</span>}
        </button>
      </div>
    </motion.aside>
  );
}
