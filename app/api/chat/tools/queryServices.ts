import { z } from "zod";
import { tool } from "ai";
import { QUERY_SERVICES_BY_MARKET } from "@/graphql/queries/services";
import { executeQuery } from "@/services/glamsquad/client";

export const queryServices = tool({
  description: "List services by market",
  parameters: z.object({
    marketId: z.string().describe("The market ID to query services for"),
  }),
  execute: async ({ marketId }) => {
    const servicesData = await executeQuery({
      query: QUERY_SERVICES_BY_MARKET,
      variables: { marketId },
    });

    return {
      message: `Here is a list of services that we have- let me know if you have any questions.`,
      services: servicesData?.data?.marketServices || [], 
    }
  },
});