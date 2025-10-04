import type { ModulePreview, Module, Review, VoteType } from "../types";
import axiosInstance from "./axiosInstance";

/********************************************************************
 * API REQUESTS
 *******************************************************************/

/**
 * Get all module previews
 */
export async function getPreviews(): Promise<ModulePreview[]> {
  try {
    const response = await axiosInstance.get("/v1/previews");

    switch (response.status) {
      // Success
      case 200:
        return response.data;
    }
    console.log("Couldn't grab previews");
  } catch {
    console.log("Couldn't grab previews");
  }
}

/**
 * Get all info on a specific module
 */
export async function getModuleDetails(code: string): Promise<Module[]> {
  try {
    const response = await axiosInstance.get(`/v1/modules/${code}`);
    switch (response.status) {
      // Success
      case 200:
      case 201:
        return response.data;
    }
    console.log("Couldn't grab module with code " + code);
  } catch {
    console.log("Couldn't grab module with code " + code);
  }
}

/**
 * Get all reviews
 */
export async function getReviews(moduleId: string): Promise<Review[]> {
  try {
    const response = await axiosInstance.get(`/v1/reviews/${moduleId}`);
    switch (response.status) {
      // Success
      case 200:
      case 201:
        return response.data;
    }
    console.log("Couldn't grab reviews");
  } catch {
    console.log("Couldn't grab reviews");
  }
}

/**
 * Cast a vote on a post
 */
export async function reviewVote(
  reviewId: string,
  userId: string,
  vote: voteType,
) {
  try {
    await axiosInstance.post("/v1/votes", {
      reviewId: reviewId,
      userId: userId,
      vote: vote,
    });
  } catch (err) {
    console.log("couldn't cast vote");
  }
}
