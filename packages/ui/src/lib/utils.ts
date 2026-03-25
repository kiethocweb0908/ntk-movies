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

export function formatType(type: string) {
  return type === "single"
    ? "Phim lẻ"
    : type === "series"
      ? "Phim bộ"
      : "Hoạt hình"
}

export const getBadgeColor = (
  type: "quality" | "lang" | "status" | "default"
) => {
  switch (type) {
    case "quality":
      return "border-yellow-500/50 bg-yellow-600/20 text-yellow-500"
    case "lang":
      return "border-blue-500/50 bg-blue-600/20 text-blue-400"
    case "status":
      return "border-emerald-500/50 bg-emerald-600/20 text-emerald-400"
    default:
      return "border-slate-600/50 bg-slate-700/30 text-slate-300"
  }
}

export const getYoutubeEmbedUrl = (url: string): string => {
  if (!url) return ""

  // Regex mạnh mẽ bao quát nhiều định dạng YouTube
  const regExp =
    /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  const match = url.match(regExp)
  const videoId = match?.[2]

  // Nếu tìm thấy ID 11 ký tự thì trả về link embed, không thì giữ nguyên url gốc
  return videoId && videoId.length === 11
    ? `https://www.youtube.com/embed/${videoId}`
    : url
}
