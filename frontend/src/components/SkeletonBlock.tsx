interface SkeletonBlockProps {
  className?: string;
}

export function SkeletonBlock({ className = '' }: SkeletonBlockProps) {
  return <span className={`block animate-pulse rounded-[5px] bg-[#738fa421] ${className}`} aria-hidden="true"/>;
}
