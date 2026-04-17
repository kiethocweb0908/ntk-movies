"use client"

import { Messages } from "@workspace/shared/schema/chatbot/chatbot.response"
import { MovieCard } from "../movie/movie-card"
import Link from "next/link"
import { Movie_URL } from "@workspace/ui/lib/config"

interface ChatbotMessageItemprops {
  msg: Messages
}

const ChatbotMessageItem = ({ msg }: ChatbotMessageItemprops) => {
  return (
    <div className={`flex ${msg.isBot ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-xs ${
          msg.isBot
            ? "rounded-tl-none bg-slate-800 text-white"
            : "rounded-tr-none bg-yellow-400 text-black"
        }`}
      >
        {msg.message}

        {/* Nếu có phim thì render List phim mini ở đây */}
        {msg.movies && msg.movies.length > 0 && (
          <div className="mt-2 flex flex-col gap-2">
            {msg.movies.map((movie) => (
              <Link key={movie.slug} href={`${Movie_URL}/${movie.slug}`}>
                <MovieCard movie={movie} isHorizontal={true} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatbotMessageItem
