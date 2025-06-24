import { z } from "zod";
import { tool } from "ai";
import { QUERY_AVAILABILITY_IN_TIME_RANGE } from "@/graphql/queries/availability";
import { executeQuery } from "@/services/glamsquad/client";

export const queryAvailability = tool({
  description: "Query availability for a service",
  parameters: z.object({
    serviceId: z.string().describe("The service ID to query availability for"),
    addOnServiceIds: z.array(z.string()).optional().describe("Optional array of add-on service IDs to query availability for"),
    street: z.string().describe("The street address to query availability for"),
    apartment: z.string().optional().describe("The apartment number to query availability for (optional)"),
    city: z.string().describe("The city to query availability for"),
    state: z.string().describe("The state to query availability for"),
    zip: z.string().describe("The zip code to query availability for"),
    type: z.enum(["home", "office"]).describe("The type of location home or office"),
    datetime: z.string().describe("The time to query availability for, in YYYY-MM-DDTXX:00:00.000Z UTC timezone format"),
  }),
  execute: async ({ serviceId, addOnServiceIds, street, apartment, city, state, zip, type, datetime }) => {
    try {
      const availabilityData = await executeQuery({
        query: QUERY_AVAILABILITY_IN_TIME_RANGE,
        variables: {
          baseServiceId: serviceId,
          addOnServiceIds: addOnServiceIds || [],
          address: {
            street,
            apartment: apartment || "",
            city,
            state,
            zip,
            type,
          },
          startDateTime: datetime,
        },
      });

      const hasAvailability = availabilityData?.data?.availableAppointmentServicesInTimeRange?.appointmentServices?.length > 0 ? 
        true : false;

      return {
        message: hasAvailability ? `Below are some available appointments` : 
          `Sorry there is nothing available then, are you free another time?`,
        availability: availabilityData?.data?.availableAppointmentServicesInTimeRange?.appointmentServices || [],
      }
    } catch (error) {
      console.error("Error querying availability:", error);
      return {
        message: `There was an error querying availability for the service. Please try again later.`,
        availability: [],
      }
    }
  },
});