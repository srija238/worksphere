import type { ReactNode, TableHTMLAttributes } from 'react';

interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  children: ReactNode;
  containerClassName?: string;
}

export function Table({ children, className = '', containerClassName = '', ...props }: TableProps) {
  return <div className={`overflow-x-auto [scrollbar-color:rgba(255,255,255,.15)_transparent] [scrollbar-width:thin] ${containerClassName}`}>
    <table className={className} {...props}>{children}</table>
  </div>;
}
