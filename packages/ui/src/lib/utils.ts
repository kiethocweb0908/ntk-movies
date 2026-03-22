import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatContent(content: string) {
  return content.replace(/<[^>]*>/g, "")
}

export function formatStatus(status: string) {
  return status === "completed"
    ? "hoàn thành"
    : status === "ongoing"
      ? "Đang diễn ra"
      : "trailer"
}
