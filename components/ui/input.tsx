import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block label-uppercase text-stone mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border border-border-light bg-ivory px-4 py-3 text-sm text-charcoal placeholder:text-warm-gray/50 transition-all duration-200 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 disabled:cursor-not-allowed disabled:opacity-50 font-body",
          error && "border-red-400 focus:border-red-400",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-red-500 font-body">{error}</p>}
    </div>
  )
);
Input.displayName = "Input";

export { Input };
