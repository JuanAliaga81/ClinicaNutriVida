import type { SelectHTMLAttributes } from 'react';

export default function Selector({ className = '', children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={`form-select ${className}`.trim()} {...props}>{children}</select>;
}
