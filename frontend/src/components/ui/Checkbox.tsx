import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = '', ...props }, ref) => {
    return (
      <div className="flex items-center gap-2">
        <input
          ref={ref}
          type="checkbox"
          className={`
            w-5 h-5 rounded
            bg-gray-800 border border-gray-700
            text-orange-500 cursor-pointer
            focus:ring-2 focus:ring-orange-500 focus:ring-offset-0
            transition-colors duration-200
            ${className}
          `}
          {...props}
        />
        {label && (
          <label className="text-sm text-gray-400 cursor-pointer hover:text-gray-300 transition-colors">
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
