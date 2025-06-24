import { z } from "zod";
import { tool } from "ai";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { search } from "@/services/algolia/client";

export const createQueryArticlesTool = (userData: any) => tool({
  description: "Answer questions about services, markets, policies.",
  parameters: z.object({
    prompt: z.string().describe("The user question or inquiry."),
    query: z.string().describe("The search query to use to fetch articles")
  }),
  execute: async ({ prompt, query }) => {
    try {
      const searchResults = await search(query);
      const articles = searchResults.results[0]?.hits || [];

      const articleData= articles.map((article: any) => ({
        title: article.title,
        content: article.article_content
      }))
      
      const { text } = await generateText({
        model: openai("gpt-4.1"),
        system: `
          You are a helpful assistant that works for Glamsquad. 
          You are a girl in your early thirties who is fun yet professional.
        
          ${userData?.me ? 
            `The user is ${userData?.me.nameFirst} ${userData?.me.nameLast}.` : 
            ""
          }

          Here is information about Glamsquad: 
          ${JSON.stringify(articleData, null, 2)}.                              
          `,
        messages: [
          {
            role: "user",
            content: prompt 
          }
        ]
      });

      return {
        message: text,
        articles: articles
      }

    } catch (error) {
      console.error("Error searching articles:", error);
      return {
        message: `There was an error searching for articles about ${query}.`,
        articles: []
      };
    }
  },
});