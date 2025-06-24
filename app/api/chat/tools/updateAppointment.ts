import { z } from "zod";
import { tool } from "ai";

export const updateAppointment = tool({
  description: "Update/reschedule an appointment for a user. The user must be logged in.",
  parameters: z.object({
    emailOrPhone: z.string().describe("The email or phone number of the user to reschedule the appointment for"),
    appointmentId: z.string().describe("The appointment ID to reschedule. Do not ask the user for this."),
    startDateTime: z.string().describe("The new start date and time of the appointment in YYYY-MM-DDTHH:mm:ss.sssZ format"),
    bookingTokens: z.array(z.string()).describe("An array of booking tokens for the new appointment time"),
    addressId: z.string().describe("The street address for the appointment"),
    services: z.array(z.object({
      id: z.string(),
      name: z.string(),
      price: z.number(),
      duration: z.number()
    })).optional().describe("The services being rescheduled"),
    totalPrice: z.number().optional().describe("The total price of the appointment")
  }),
  execute: async ({ appointmentId, startDateTime, bookingTokens, addressId, services, totalPrice }) => {
    return {
      message: "Please confirm your rescheduled appointment details below.",
      rescheduleParams: {
        appointmentId,
        startDateTime,
        bookingTokens,
        addressId,
        services,
        totalPrice
      }
    }
  },
});