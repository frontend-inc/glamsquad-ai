import { z } from "zod";
import { tool } from "ai";
import gorgiasClient from "@/services/gorgias/client";

export const createTicket = tool({
  description: "Create a support help ticket for customer issues or feedback. Use this when a user needs assistance or wants to report a problem.",
  parameters: z.object({
    name: z.string().describe("The customer's full name"),
    email: z.string().email().describe("The customer's email address"),
    bodyHtml: z.string().describe("The HTML formatted message body of the support ticket"),
    bodyText: z.string().describe("The plain text version of the support ticket message"),
  }),
  execute: async ({ name, email, bodyHtml, bodyText }) => {
    try {
      const ticket = await gorgiasClient.createTicket({
        customer: {
          name,
          email,
        },
        bodyHtml,
        bodyText,
      });

      return {
        message: "Support ticket created successfully. Our team will respond to you shortly.",
        ticketId: ticket.id,
        ticketNumber: ticket.number,
      };
    } catch (error) {
      console.error("Error creating support ticket:", error);
      return {
        message: "There was an error creating your support ticket. Please try again or contact us directly.",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});