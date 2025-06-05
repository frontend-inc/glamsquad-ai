import { GraphQLClient } from 'graphql-request';

const endpoint = 'https://starbase-develop.glamsquad.com/api/v1/graphql';

export const graphqlClient = new GraphQLClient(endpoint, {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.JWT_TOKEN}`,
  },
})

export async function executeQuery<T = any>(query: string, variables?: any): Promise<{ data: T | null; error: Error | null }> {
  try {
    const data = await graphqlClient.request<T>(query, variables);
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

