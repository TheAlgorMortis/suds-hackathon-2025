import type {
  ModulePreview,
  Module,
  Review,
  VoteType,
  ModuleStatus,
  User,
} from "../types";
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
export async function getReviews(moduleId: string, userId): Promise<Review[]> {
  try {
    const response = await axiosInstance.get(
      `/v1/reviews/${moduleId}/${userId}`,
    );
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

/********************************************
 * Posting, patching, and deleting reviews
 *******************************************/

/**
 * Get status of module
 */
export async function getModuleStatus(
  moduleId: string,
  userId: string,
): Promise<ModuleStatus[]> {
  try {
    const response = await axiosInstance.get(
      `/v1/module-status/${moduleId}/${userId}`,
    );

    switch (response.status) {
      // Success
      case 200:
        return response.data;
    }
  } catch {
    console.log("Couldn't grab status");
  }
}

/**
 * Cast a vote on a post
 */
export async function postReview(
  userId: string,
  moduleId: string,
  title: string,
  text: string,
  rating: number,
) {
  try {
    const response = await axiosInstance.post("/v1/reviews", {
      userId: userId,
      moduleId: moduleId,
      title: title,
      text: text,
      rating: rating,
    });

    switch (response.status) {
      // Success
      case 200:
        return response.data;
    }
  } catch (err) {
    console.log("couldn't post review");
  }
}

/**
 * patch a review
 */
export async function patchReview(
  userId: string,
  moduleId: string,
  title: string,
  text: string,
  rating: number,
) {
  try {
    const response = await axiosInstance.patch("/v1/reviews", {
      userId: userId,
      moduleId: moduleId,
      title: title,
      text: text,
      rating: rating,
    });

    switch (response.status) {
      // Success
      case 200:
        return response.data;
    }
  } catch (err) {
    console.log("couldn't patch review");
  }
}

/**
 * delete a review
 */
export async function deleteReview(userId: string, moduleId: string) {
  try {
    const response = await axiosInstance.delete(
      `/v1/reviews/${moduleId}/${userId}`,
    );

    switch (response.status) {
      // Success
      case 200:
        return response.data;
    }
  } catch (err) {
    console.log("couldn't delete review review");
  }
}

/**
 * Get tutor List
 */
export async function getTutors(moduleId: string): Promise<Tutor[]> {
  try {
    const response = await axiosInstance.get(`/v1/tutors/${moduleId}`);

    switch (response.status) {
      // Success
      case 200:
        return response.data;
    }
  } catch {
    console.log("Couldn't grab status");
  }
}

/**
 * Get user info
 */
export async function getUserInfo(username: string): Promise<User> {
  try {
    const response = await axiosInstance.get(`/v1/user/${username}`);
    switch (response.status) {
      // Success
      case 200:
        return response.data;
    }
  } catch {
    console.log("Couldn't grab user info");
  }
}
