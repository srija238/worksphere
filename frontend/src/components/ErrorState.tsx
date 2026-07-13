import type { ReactNode } from 'react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
  icon?: ReactNode;
}

export function ErrorState({ message, onRetry, icon }: ErrorStateProps) {
  return <section className="flex min-h-[calc(100vh-160px)] items-center justify-center" role="alert">
    <div className="w-full max-w-lg rounded-lg border border-[#ff544866] bg-[#0b1f2fdb] px-8 py-10 text-center shadow-2xl">
      {icon && <span className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-full bg-[#9a31275c] text-[#ff766d]">{icon}</span>}
      <h1 className="m-0 text-xl font-semibold tracking-normal text-[#f7f9fc]">Unable to load data</h1>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#b8c3ce]">{message}</p>
      <button type="button" onClick={onRetry} className="mx-auto mt-6 flex h-10 items-center gap-2 rounded-md bg-[#ff5a16] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#e94b0b] focus:outline-none focus:ring-2 focus:ring-[#ff8a4e] focus:ring-offset-2 focus:ring-offset-[#0b1f2f]">
        Retry
      </button>
    </div>
  </section>;
}
