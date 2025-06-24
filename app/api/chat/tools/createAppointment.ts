import { z } from "zod";
import { tool } from "ai";

export const createAppointment = tool({
  description: "Create an appointment confirmation for a service at a specific time, date, location and address for a user. The user must be logged in.",
  parameters: z.object({
    startDateTime: z.string().describe("The start date and time of the appointment in YYYY-MM-DDTHH:mm:ss.sssZ format"),
    bookingTokens: z.array(z.string()).describe("An array of booking tokens for the appointment"),
    addressId: z.string().describe("The street address for the appointment"),
    userId: z.string().describe("The ID of the user creating the appointment"),
    services: z.array(z.object({
      id: z.string(),
      name: z.string(),
      price: z.number(),
      duration: z.number()
    })).describe("The services being booked"),
    addOnServices: z.array(z.object({
      id: z.string(),
      name: z.string(),
      price: z.number(),
      duration: z.number()
    })).optional().describe("Optional add-on services"),
    totalPrice: z.number().describe("The total price of the booking including all services and add-ons")
  }),
  execute: async ({ startDateTime, bookingTokens, addressId, userId, services, addOnServices, totalPrice }) => {
    return {
      message: "Please confirm your booking details below.",
      bookingParams: {
        startDateTime,
        bookingTokens,
        addressId,
        userId,
        services,
        addOnServices,
        totalPrice
      }
    }
  },
});