import { z } from "zod";
import { tool } from "ai";

export const createQueryMeTool = (userData: any) => tool({
  description: "Query the current user account including appointments and addresses",
  parameters: z.object({
    email: z.string().describe("The user's email address"),
  }),
  execute: async ({ email }) => {
    try {
      return userData;
    } catch (error) {
      return {
        error: "Failed to query user data",
        details: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});