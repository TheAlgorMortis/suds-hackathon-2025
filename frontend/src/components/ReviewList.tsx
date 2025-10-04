import { useEffect, useMemo, useState } from "react";
import type { Review } from "../types";
import ReviewPost from "./ReviewPost";
import { getModuleStatus } from "../api/moduleApi";

interface ReviewListProps {
  reviews: Review[] | null | undefined;
  moduleId: string;
}

export default function ReviewList({ reviews, moduleId }: ReviewListProps) {
  // --- derived flags (no early returns before hooks) ---
  const mrntId = localStorage.getItem("MRNTid") ?? "";
  const curUsername = (
    localStorage.getItem("MRNTusername") ?? ""
  ).toLowerCase();
  const isLoggedIn = mrntId !== "";

  // --- state (hooks must be unconditional) ---
  const [userStatus, setUserStatus] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState(false);
  const [newReview, setNewReview] = useState(null);

  // --- fetch user status when we can ---
  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }
    let active = true;
    (async () => {
      try {
        const status = await getModuleStatus(moduleId, mrntId);
        if (active) setUserStatus(status.status);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [isLoggedIn, moduleId, mrntId]);

  // --- order reviews: current user's review first, others by votes desc ---
  const { orderedReviews, hasMyReview } = useMemo(() => {
    const arr: Review[] = Array.isArray(reviews) ? reviews.slice() : [];

    const myIndex = arr.findIndex(
      (r) => (r.username ?? "").toLowerCase() === curUsername,
    );

    let myReview: Review | null = null;
    if (myIndex >= 0) {
      myReview = arr.splice(myIndex, 1)[0];
    }

    arr.sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0));
    const ordered = myReview ? [myReview, ...arr] : arr;

    return { orderedReviews: ordered, hasMyReview: !!myReview };
  }, [reviews, curUsername]);

  // --- UI gates ---
  if (!isLoggedIn) {
    return (
      <div>
        <h2>You must log in to view reviews</h2>
      </div>
    );
  }

  if (loading) return <p>Loading...</p>;

  const canPostBase =
    userStatus === "failed" ||
    userStatus === "passed" ||
    userStatus === "distinction";

  const canPost = canPostBase && !hasMyReview;

  const createNewReview = () => {
    setNewPost(true);
    setNewReview({
      reviewId: null,
      username: localStorage.getItem("MRNTusername"),
      title: "Enter title here",
      text: "Enter text here",
      rating: 0,
      date: "To be determined",
      votes: 0,
      userVote: null,
    });
  };

  return (
    <div>
      {canPost && !newPost && (
        <button onClick={createNewReview}>Create New Review</button>
      )}
      {newPost && (
        <ReviewPost
          key={0}
          review={newReview}
          editable={true}
          isNewPost={true}
          setIsNewPost={setNewPost}
          moduleId={moduleId}
        />
      )}

      {orderedReviews.map((review) => (
        <ReviewPost
          key={review.id ?? `${review.username}-${review.moduleId ?? ""}`}
          review={review}
          editable={(review.username ?? "").toLowerCase() === curUsername}
          isNewPost={newPost}
          setIsNewPost={setNewPost}
          moduleId={moduleId}
        />
      ))}
    </div>
  );
}
