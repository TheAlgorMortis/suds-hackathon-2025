import type { ModulePreview, Module } from "../types";
import axiosInstance, { BASE_URL } from "./axiosInstance";

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
/* export async function getModuleDatails(code: string) */
/* ): Promise<Module[]> { */
/*   try { */
/*     const response = await axiosInstance.get(`/v1/modules/${code}`); */
/**/
/*     switch (response.status) { */
/*       // Success */
/*       case 200: */
/*         return {}; */
/*     } */
/*     console.log("Couldn't grab previews) */
/*   } catch (err) { */
/*     const e = err as AxiosError<LoginApiError>; */
/*     console.log("Couldn't grab previews") */
/*   } */
/* } */
