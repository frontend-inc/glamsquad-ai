import { streamText, tool } from "ai"
import { openai } from "@ai-sdk/openai"
import { QUERY_MARKETS } from "@/graphql/queries/markets";
import { QUERY_SERVICES_BY_MARKET } from "@/graphql/queries/services";
import { QUERY_AVAILABILITY } from "@/graphql/queries/availability";
import { z } from "zod";

export async function executeQuery(query: any, variables: any ) {
  try {
    const response = await fetch("https://starbase-develop.glamsquad.com/api/v1/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
  
    You are a helpful AI assistant for Glamsquad.
    
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
          
          console.log("Querying availability with parameters:", {
            serviceId,
            addOnServiceIds,
            street,
            apartment,
            city,
            state,
            zip,
            type,
            datetime
          });

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
      queryServices: tool({
        description: "List services by market",
        parameters: z.object({
          marketId: z.string().describe("The market ID to query services for"),
        }),
        execute: async ({ marketId }) => {
          const servicesData = await executeQuery(QUERY_SERVICES_BY_MARKET, { marketId });

          return {
            message: `Here are the services available`,
            services: servicesData?.data?.marketServices || [], 
          }
        },
      })
    },
    messages,
  })

  return response.toDataStreamResponse()
}
