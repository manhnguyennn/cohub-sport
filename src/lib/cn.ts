/**
 * className helper — concat list of strings, ignore falsy.
 * Lightweight alternative cho clsx khi không cần object syntax.
 */
export function cn(...inputs: Array<string | false | null | undefined>): string {
  return inputs.filter(Boolean).join(' ');
}
