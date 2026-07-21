import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block label-uppercase text-stone mb-2">
          {label}
        </label>
      )}
      <textarea
        className={cn(
          "flex min-h-[100px] w-full rounded-xl border border-border-light bg-ivory px-4 py-3 text-sm text-charcoal placeholder:text-warm-gray/50 transition-all duration-200 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 disabled:cursor-not-allowed disabled:opacity-50 resize-none font-body",
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
Textarea.displayName = "Textarea";

export { Textarea };
