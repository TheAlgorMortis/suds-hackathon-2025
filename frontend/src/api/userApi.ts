import type { LoginResponse } from "../types";
import axiosInstance, { BASE_URL } from "./axiosInstance";

/********************************************************************
 * API REQUESTS
 *******************************************************************/

/**
 * Check if the server is alive
 *
 * @returns {Promise<boolean>} Whether the server is alive
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const res = await axiosInstance.get("/v1/health");
    return res.status === 200;
  } catch {
    return false;
  }
}

/**
 * Login with username and password
 *
 * @param {String} username - The user's username
 * @param {String} password - The user's password
 *
 * @returns
 */
export async function authLogin(
  username: string,
  password: string,
): Promise<LoginResponse> {
  try {
    // request auth
    const response = await axiosInstance.post("/v1/auth/login", {
      usernameEmail: username,
      password: password,
    });

    switch (response.status) {
      // Success
      case 200:
        localStorage.setItem("MRNTid", response.data.userId);
        return { success: true };

      // Authorization failed
      default:
        return {
          success: false,
          message: response.data.detail,
        };
    }
  } catch (err) {
    const e = err as AxiosError<LoginApiError>;
    return {
      success: false,
      message: e.response.data.detail,
    };
  }
}
