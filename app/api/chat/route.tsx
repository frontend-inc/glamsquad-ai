import { streamText, tool } from "ai"
import { openai } from "@ai-sdk/openai"
import { QUERY_MARKETS } from "@/graphql/queries/markets";
import { QUERY_SERVICES_BY_MARKET } from "@/graphql/queries/services";
import { QUERY_AVAILABILITY } from "@/graphql/queries/availability";
import {
   QUERY_USER_BY_EMAIL,
   QUERY_USER_BY_PHONE 
} from "@/graphql/queries/users";
import {
  MUTATION_CREATE_APPOINTMENT 
} from "@/graphql/mutations/appointments";
import { z } from "zod";

export async function executeQuery(query: any, variables: any ) {
  const GLAMSQUAD_API_URL = process.env.GLAMSQUAD_API_URL as string 
  try {
    const response = await fetch(GLAMSQUAD_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.JWT_TOKEN}`, 
      },
      body: JSON.stringify({
        query,
        variables
      })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}


export async function POST(req: Request) {

  const { messages } = await req.json()
  
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
            const availabilityData = await executeQuery(QUERY_AVAILABILITY, {  
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

            const hasAvailability = availabilityData?.data?.availableAppointmentServices?.appointmentService ? 
              true : false;

            return {
              message: hasAvailability ? `Below is a list of available appointments` : 
                `There are no available appointments for the service at this time. Please choose another time.`,
              availability: availabilityData?.data?.availableAppointmentServices || {},
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
      queryUserByEmail: tool({
        description: "Find a user and address by email",
        parameters: z.object({
          email: z.string().email().describe("The email address to query user by"),
        }),
        execute: async ({ email }) => {

          const userData = await executeQuery(QUERY_USER_BY_EMAIL, { email });

          if (!userData?.data?.user) {
            return {
              message: `No user found with the email ${email}. Please check the email and try again.`,
              user: null,
            }
          }

          const user = userData.data.user;

          return {
            message: `User found: ${user.nameFirst} ${user.nameLast} (${user.email})`,
            user: user,
          }          
        }
      }),
      queryUserByPhone: tool({
        description: "Find a user and address by phone",
        parameters: z.object({
          phone: z.string().email().describe("The phone number to query user by in +1XXXXXXXXXX format"),
        }),
        execute: async ({ phone }) => {

          const userData = await executeQuery(QUERY_USER_BY_PHONE, { phone });

          if (!userData?.data?.user) {
            return {
              message: `No user found with the email ${phone}. Please check the phone number and try again.`,
              user: null,
            }
          }

          const user = userData.data.user;

          return {
            message: `User found: ${user.nameFirst} ${user.nameLast} (${user.email})`,
            user: user,
          }          
        }
      }),
      queryServices: tool({
        description: "List services by market",
        parameters: z.object({
          marketId: z.string().describe("The market ID to query services for"),
        }),
        execute: async ({ marketId }) => {
          const servicesData = await executeQuery(QUERY_SERVICES_BY_MARKET, { marketId });

          console.log("Services Data:", JSON.stringify(servicesData, null, 2));
          return {
            message: `Here is a list of services that we have- let me know if you have any questions.`,
            services: servicesData?.data?.marketServices || [], 
          }
        },
      }),
      createAppointment: tool({
        description: "Create an appointment for a service at a specific time, date, location and address for a user",
        parameters: z.object({
          startDateTime: z.string().describe("The start date and time of the appointment in YYYY-MM-DDTHH:mm:ss.sssZ format"),
          bookingTokens: z.array(z.string()).describe("An array of booking tokens for the appointment"),
          addressId: z.string().describe("The street address for the appointment"),
          userId: z.string().describe("The ID of the user creating the appointment"),
        }),
        execute: async ({ startDateTime, bookingTokens, addressId, userId }) => {

          const availabilityData = await executeQuery(MUTATION_CREATE_APPOINTMENT, { appointment: {
            startDateTime: startDateTime,
            bookingTokens: bookingTokens,
            addressId: addressId,
            creatorId: userId,
            ownerId: userId
            } 
          })

          if (!availabilityData?.data?.createAppointment) {
            return {
              message: `There was an error creating the appointment. Please try again later.`,
              appointment: null,
            }
          }
          const createdAppointment = availabilityData.data.createAppointment;
          return {
            message: `Appointment created successfully for ${createdAppointment.startDateTime} at ${createdAppointment.address.street}, ${createdAppointment.address.city}, ${createdAppointment.address.state}.`,
            appointment: createdAppointment,
          }
        },
      }),
    },
    messages,
  })

  return response.toDataStreamResponse()
}
