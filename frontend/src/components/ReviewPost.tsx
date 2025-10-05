import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Voter from "./Voter.tsx";
import Rater from "./Rater.tsx";
import type { Review } from "../types";
import { postReview, patchReview, deleteReview } from "../api/moduleApi.ts";
import "./Bodies.css";

interface ReviewPostProps {
  review: Review;
  editable: boolean;
  isNewPost: boolean;
  moduleId: string;
  setIsNewPost: React.Dispatch<React.SetStateAction<string>>;
}
export default function ReviewPost({
  review,
  editable,
  isNewPost,
  setIsNewPost,
  moduleId,
}: ReviewPostProps) {
  const navigate = useNavigate();
  const [newPost, setNewPost] = useState(isNewPost);
  const [rating, setRating] = useState(review.rating);
  const [title, setTitle] = useState(review.title);
  const [text, setText] = useState(review.text);
  const [isDeleted, setIsDeleted] = useState(false);
  const userId = localStorage.getItem("MRNTid");

  const submitChanges = () => {
    if (newPost) {
      postReview(userId, moduleId, title, text, rating);
      setNewPost(false);
    } else {
      patchReview(userId, moduleId, title, text, rating);
    }
  };

  const delReview = () => {
    if (!newPost) {
      deleteReview(userId, moduleId);
      setIsDeleted(true);
      setIsNewPost(false);
      return null;
    } else {
      setIsNewPost(false);
    }
  };

  if (isDeleted) {
    return;
  }

  const navTo = (username) => {
    navigate(`/users/${username}`, { replace: true });
  };

  const date = new Date(review.date);

  return (
    <div className="sectionBlock">
      <h2
        className="sectionBlockHeading"
        contentEditable={editable}
        suppressContentEditableWarning={true}
        onInput={(e: React.FormEvent<HTMLHeadingElement>) =>
          setTitle(e.currentTarget.textContent ?? "")
        }
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault();
        }}
      >
        {review.title}
      </h2>
      <h3 className="subtitleRow">
        by{" "}
        <button
          className="userButton"
          onClick={() => {
            navTo(review.username);
          }}
        >
          {review.username}
        </button>
        on {date.toLocaleString()}
      </h3>
      <p
        contentEditable={editable}
        suppressContentEditableWarning={true}
        onInput={(e: React.FormEvent<HTMLParagraphElement>) =>
          setText(e.currentTarget.textContent ?? "")
        }
      >
        {review.text}
      </p>
      <h3 className="borderlessHeading">
        Rating:
        <Rater
          initialRating={rating}
          setFunction={setRating}
          editable={editable}
        />
      </h3>
      {editable && (
        <div className="flexRow">
          <button className="outerButton" onClick={submitChanges}>
            Submit Changes{" "}
          </button>
          <button className="outerButton" onClick={delReview}>
            Delete Review{" "}
          </button>
        </div>
      )}
      <Voter
        reviewId={review.reviewId}
        myInitialVote={review.userVote}
        totalVotes={review.votes}
      />
    </div>
  );
}

// Text/body (p)
