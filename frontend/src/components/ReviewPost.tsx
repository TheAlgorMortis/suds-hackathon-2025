import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getModuleDetails } from "../api/moduleApi";
import Voter from "./Voter.tsx";
import type { Review } from "../types";
import "./Bodies.css";

interface ReviewPostProps {
  review: Review;
}
export default function ReviewPost({ review }: ReviewPostProps) {
  return (
    <div className="sectionBlock">
      <h2> {review.title} </h2>
      <h3>
        {" "}
        by {review.username} on {review.date}
      </h3>
      <h1> vote:{null} </h1>
      <h3> Rating: {review.rating} </h3>
      <p> {review.text} </p>
      <Voter
        reviewId={review.reviewId}
        myInitialVote={review.userVote}
        totalVotes={review.votes}
      />
    </div>
  );
}
