import { streamText, tool } from "ai"
import { openai } from "@ai-sdk/openai"
import { QUERY_MARKETS } from "@/graphql/queries/markets";
import { QUERY_SERVICES_BY_MARKET } from "@/graphql/queries/services";
import { QUERY_AVAILABILITY_IN_TIME_RANGE } from "@/graphql/queries/availability";
import {
   QUERY_ME 
} from "@/graphql/queries/users";
import { z } from "zod";
import { executeQuery } from "@/services/glamsquad/client";

export async function POST(req: Request) {

  const { messages, data } = await req.json()
  const accessToken = data?.accessToken
  
  const userData = await executeQuery(QUERY_ME, {}, accessToken);

  const marketsData = await executeQuery(QUERY_MARKETS, {});

  // todays date and time in EST timezone 
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  const formattedDate = formatter.format(now).replace(',', '');

  const systemPrompt = `
  
    You are a helpful assistant that works for Glamsquad. You are a girl in your early 
    twenties, who is fun, perky, casual and speaks like a millennial. 
    
    The current user is: 
    ${userData?.data?.me ? 
      `The user is logged in as ${userData?.data?.me.nameFirst} ${userData?.data?.me.nameLast} with email ${userData?.data?.me.email}.` : 
      "The user is not logged in. Ask the user to signin to use this service."
    }

    You help customers find services and book appointments for hair, makeup, nails, and more.
    
    Todays date in EST timezone is ${formattedDate}.
    
    Here is a JSON array of services and markets available:
    ${JSON.stringify(marketsData, null, 2)}

    {
      "message": "Your response here", // do not respond in markdown
    }      

    IMPORTANT: DO NOT wrap the reponse in \`\`\`json or any other code block.
  `

  const response = await streamText({
    model: openai("gpt-4o"),    
    system: systemPrompt,
    tools: {
      queryAvailability: tool({
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
        execute: async ({ serviceId, addOnServiceIds,street, apartment, city, state, zip, type, datetime }) => {
          
          try{
            const availabilityData = await executeQuery(QUERY_AVAILABILITY_IN_TIME_RANGE, {  
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
      }),     
      queryMe: tool({
        description: "Query the current user account including appointments and addresses",
        parameters: z.object({
          email: z.string().describe("The email of the user to query account information for")
        }),
        execute: async () => {
          return {
            message: "Here is your account information.",
            user: userData?.data?.me || null,
          }
        },
      }),
      queryServices: tool({
        description: "List services by market",
        parameters: z.object({
          marketId: z.string().describe("The market ID to query services for"),
        }),
        execute: async ({ marketId }) => {
          const servicesData = await executeQuery(QUERY_SERVICES_BY_MARKET, { marketId });

          return {
            message: `Here is a list of services that we have- let me know if you have any questions.`,
            services: servicesData?.data?.marketServices || [], 
          }
        },
      }),
      createAppointment: tool({
        description: "Create an appointment confirmation for a service at a specific time, date, location and address for a user",
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
      }),
      updateAppointment: tool({
        description: "Update/reschedule an appointment for a user",
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
      }),
    },
    messages,
  })

  return response.toDataStreamResponse()
}
