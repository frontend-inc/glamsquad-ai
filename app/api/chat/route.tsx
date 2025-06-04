import { streamText, tool } from "ai"
import { openai } from "@ai-sdk/openai"
import { QUERY_MARKETS, QUERY_SERVICES_BY_MARKET } from "@/graphql/queries/markets";
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

  const systemPrompt = `
  
    You are a helpful AI assistant for Glamsquad.

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
      greetUser: {
        description: "Greet the user",
        parameters: z.object({          
          name: z.string().describe("The name of the user to greet"),          
        }),
        execute: async ({ name }) => {
          return {
            message: `Hello ${name}! I was a tool invocation.`,
          }
        },
      },
      queryServices: tool({
        description: "Query services by market",
        parameters: z.object({
          marketId: z.string().describe("The market ID to query services for"),
        }),
        execute: async ({ marketId }) => {
          const servicesData = await executeQuery(QUERY_SERVICES_BY_MARKET, { marketId });
          return {
            message: `Here are the services available: ${JSON.stringify(servicesData)}`,
          }
        },
      })
    },
    messages,
  })

  return response.toDataStreamResponse()
}
