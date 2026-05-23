import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import { motion } from "framer-motion";
import appCss from "@/styles.css?url";
import { BackgroundFX } from "@/components/layout/BackgroundFX";
import { Navbar } from "@/components/layout/Navbar";
import { PageTransition } from "@/components/motion";
import { ShimmerButton } from "@/components/motion/ShimmerButton";
import { fadeUp } from "@/lib/motion";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="max-w-md text-center surface-elevated p-10 sm:p-12"
      >
        <motion.h1
          className="text-7xl font-bold gradient-text"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          404
        </motion.h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6 flex justify-center">
          <ShimmerButton to="/">Go home</ShimmerButton>
        </div>
      </motion.div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        animate="show"
        className="max-w-md text-center surface-elevated p-10 sm:p-12"
      >
        <h1 className="text-xl font-semibold tracking-tight">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">Try again or head back home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <ShimmerButton
            onClick={() => {
              router.invalidate();
              reset();
            }}
          >
            Try again
          </ShimmerButton>
          <ShimmerButton href="/" variant="glass">
            Go home
          </ShimmerButton>
        </div>
      </motion.div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Calculus.ai — AI-powered Calculus Solver" },
      {
        name: "description",
        content:
          "Solve derivatives and integrals step-by-step with an AI tutor and stunning graph visualizations.",
      },
      { name: "theme-color", content: "#0a0a17" },
      { property: "og:title", content: "Calculus.ai — AI Calculus Solver" },
      {
        property: "og:description",
        content: "Differentiation, integration, and an AI tutor — reimagined.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <BackgroundFX />
      <Navbar />
      <div className="pt-[5.5rem] sm:pt-24 min-h-screen">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </div>
    </QueryClientProvider>
  );
}
