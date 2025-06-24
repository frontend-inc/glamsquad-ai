import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import { QUERY_MARKETS } from "@/graphql/queries/markets";
import {
   QUERY_ME 
} from "@/graphql/queries/users";
import { executeQuery } from "@/services/glamsquad/client";
import {
  queryAvailability,
  createQueryMeTool,
  queryServices,
  createAppointment,
  updateAppointment,
  createQueryArticlesTool,
  createTicket
} from "./tools";

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
    thirties, who is fun yet professional. 
    
    Do not make assumptions about company policies, use the queryArticles tool to answer questions about services, markets, policies, and other inquiries.

    The current user is: 
    ${userData?.data?.me ? 
      `The user is logged in as ${userData?.data?.me.nameFirst} ${userData?.data?.me.nameLast} with email ${userData?.data?.me.email}.` : 
      "The user is not logged in. You can help them answer questions but cannot book appointments or modify appoinments."
    }

    You help customers find services and book appointments for hair, makeup, nails, and more. Look up services 
    in their market before confirming what services area available.
    
    Todays date in EST timezone is ${formattedDate}.
    
    Here is a JSON array of services and markets available:
    ${JSON.stringify(marketsData, null, 2)}

    {
      "message": "Your response here", // do not respond in markdown
    }      

    IMPORTANT: DO NOT wrap the reponse in \`\`\`json or any other code block.
  `

  const response = await streamText({
    model: openai("gpt-4.1"),    
    system: systemPrompt,
    maxSteps: 5,
    tools: {
      queryAvailability,
      queryMe: createQueryMeTool(userData?.data),
      queryServices,
      createAppointment,
      updateAppointment,
      queryArticles: createQueryArticlesTool(userData?.data),
      createTicket,
    },
    messages,
  })

  return response.toDataStreamResponse()
}
