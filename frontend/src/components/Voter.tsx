import { LuNut } from "react-icons/lu";
import { BiSolidUpvote } from "react-icons/bi";
import { BiUpvote } from "react-icons/bi";
import { BiDownvote } from "react-icons/bi";
import { BiSolidDownvote } from "react-icons/bi";
import type { VoteType } from "../types";
import { useState } from "react";
import { reviewVote } from "../api/moduleApi";

interface VoterProps {
  reviewId: Review;
  myInitialVote: VoteType;
  totalVotes: number;
}
export default function VoterPost({
  reviewId,
  myInitialVote,
  totalVotes,
}: VoterProps) {
  const [myVote, setMyVote] = useState(myInitialVote);
  const [curVotes, setCurVotes] = useState(totalVotes);
  const userId = localStorage.getItem("MRNTid");

  /* Cast a upvote */
  const upVote = () => {
    if (myVote === "up") {
      setCurVotes(curVotes - 1);
      setMyVote(null);
      reviewVote(reviewId, userId, null);
    } else if (myVote === "down") {
      setCurVotes(curVotes + 2);
      setMyVote("up");
      reviewVote(reviewId, userId, "up");
    } else {
      setCurVotes(curVotes + 1);
      setMyVote("up");
      reviewVote(reviewId, userId, "up");
    }
  };

  /* Cast a downvote */
  const downVote = () => {
    if (myVote === "down") {
      setCurVotes(curVotes + 1);
      setMyVote(null);
      reviewVote(reviewId, userId, null);
    } else if (myVote === "up") {
      setCurVotes(curVotes - 2);
      setMyVote("down");
      reviewVote(reviewId, userId, "down");
    } else {
      setCurVotes(curVotes - 1);
      setMyVote("down");
      reviewVote(reviewId, userId, "down");
    }
  };

  const upNut = myVote === "up" ? <BiSolidUpvote /> : <BiUpvote />;
  const downNut = myVote === "down" ? <BiSolidDownvote /> : <BiDownvote />;

  return (
    <div>
      <h4>
        <LuNut /> {curVotes} acorns
      </h4>
      <button onClick={upVote}> {upNut} </button>
      <button onClick={downVote}> {downNut} </button>
    </div>
  );
}
