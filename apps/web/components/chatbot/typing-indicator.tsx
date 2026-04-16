const TypingIndicator = () => {
  return (
    <div className="flex justify-start">
      <div className="rounded-2xl rounded-tl-none bg-slate-800 px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-textHover animation-duration-[0.8s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-textHover animation-duration-[0.8s] [animation-delay:0.2s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-textHover animation-duration-[0.8s] [animation-delay:0.4s]" />
        </div>
      </div>
    </div>
  )
}

export default TypingIndicator
