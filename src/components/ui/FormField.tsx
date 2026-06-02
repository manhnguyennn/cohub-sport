import type { ReactNode } from 'react';

type FormFieldProps = {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  children: ReactNode;
};

export default function FormField({ label, htmlFor, hint, error, children }: FormFieldProps) {
  return (
    <div className="form-field">
      <label className="form-field__label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {hint && !error && <div className="form-field__hint">{hint}</div>}
      {error && <div className="form-field__error">{error}</div>}
    </div>
  );
}
