interface EmptyStateProps {
  message?: string;
  className?: string;
}

export function EmptyState({ message = 'No data available', className = '' }: EmptyStateProps) {
  return <p className={`px-6 py-10 text-center text-xs text-[#aeb9c7] ${className}`}>{message}</p>;
}
