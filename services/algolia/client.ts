import { liteClient } from "algoliasearch/lite";

// Initialize Algolia client with environment variables
const client = liteClient(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || "",
  process.env.NEXT_PUBLIC_ALGOLIA_API_KEY || ""
);

// Search function for the entities-v2 index
export async function search(query: string) {
  try {
    const response = await client.search({
      requests: [
        {
          indexName: "entities-v2",
          query: query,
          hitsPerPage: 50,
        },
      ],
    });

    return response;
  } catch (error) {
    console.error("Error searching Algolia:", error);
    throw error;
  }
}

// Export the client for direct use if needed
export { client };