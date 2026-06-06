import Link from "next/link";
import { ReactNode } from "react";

interface MathShellProps {
  children: ReactNode;
  showBack?: boolean;
}

export function MathShell({ children, showBack = true }: MathShellProps) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[390px] flex-col overflow-hidden rounded-[28px] bg-mq-bg shadow-mq phone-frame">
      {showBack && (
        <div className="border-b border-black/5 bg-white px-4 py-2">
          <Link href="/" className="text-sm font-bold text-bq-muted">
            ← BrainQuest
          </Link>
          <span className="mx-2 text-bq-muted">·</span>
          <Link href="/math" className="text-sm font-bold text-mq-primary">
            MathQuest
          </Link>
        </div>
      )}
      {children}
    </div>
  );
}
