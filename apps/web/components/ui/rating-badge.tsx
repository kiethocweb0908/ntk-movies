import { Badge } from "@workspace/ui/components/badge"
import { Star } from "lucide-react"

interface RatingBadgeProps {
  variant: "imdb" | "tmdb"
  vote: string
}

const RatingBadge = ({ variant, vote }: RatingBadgeProps) => {
  if (variant === "imdb")
    return (
      <Badge variant={"imdb"}>
        <Star size={14} fill="currentColor" />
        <span>{vote}</span>
      </Badge>
    )

  return <Badge variant={"tmdb"}>TMDB {vote}</Badge>
}

export default RatingBadge
