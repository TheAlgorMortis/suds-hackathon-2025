import type { Review } from "../types";
import ReviewPost from "./ReviewPost";

interface ReviewListProps {
  reviews: Review[];
}

export default function ReviewList({ reviews }: ReviewListProps) {
  const list: Review[] = Array.isArray(reviews) ? reviews.slice() : [];
  list.sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0));

  return (
    <div>
      {list.map((review) => (
        <ReviewPost review={review} />
      ))}
    </div>
  );
}
