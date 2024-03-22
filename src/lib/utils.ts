import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Used to combine css classes

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
