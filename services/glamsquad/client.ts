import JSSHA from 'jssha';
import { get } from 'lodash';


interface ErrorType extends Error {
  res?: Response;
  body?: any;
}

export async function makeSignedRequest(method: string, endpoint: string, body?: any, accessToken?: string) {
  const apiUrl = process.env.GLAMSQUAD_API_URL
  const clientId = process.env.GLAMSQUAD_CLIENT_ID
  const clientSecret = process.env.GLAMSQUAD_CLIENT_SECRET as string

  if (!apiUrl) {
    throw new Error('GLAMSQUAD_API_URL environment variable is required');
  }

  // If accessToken is provided, we don't need client credentials
  if (!accessToken && (!clientId || !clientSecret)) {
    throw new Error('GLAMSQUAD_CLIENT_ID and GLAMSQUAD_CLIENT_SECRET environment variables are required when accessToken is not provided');
  }

  try {
    const url = apiUrl + endpoint;
    let authHeader: string;

    if (accessToken) {
      // Use the provided access token
      authHeader = `Bearer ${accessToken}`;
    } else {
      // Use the existing authentication method
      const sha = new JSSHA('SHA-256', 'TEXT');
      sha.setHMACKey(clientSecret, 'TEXT');
      sha.update([method, endpoint, JSON.stringify(body)].join('|'));
      const hmac = sha.getHMAC('B64');
      const glamToken = [clientId, hmac].join(':');
      
      authHeader = `Glam ${glamToken}`;
    }

    const res = await fetch(url, {
      method,
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
    });

    if (res.status === 202 || res.status === 404) {
      return res;
    }

    const response = await res.json();
    if (res.status > 399) {
      console.error('Error response from server:', response);
      const err: ErrorType = new Error(get(response, 'errors.0.message') || 'Error making request.');
      err.res = res;
      err.body = response;
      throw err;
    }

    return response;
  } catch (error) {
    console.error('Error making signed request', method, endpoint, error);
    throw error;
  }
}

export async function executeQuery<T = any>(query: string, variables?: any, accessToken?: string): Promise<{ data: T | null; error: Error | null }> {
  try {
    const response = await makeSignedRequest('POST', '/api/v1/graphql', {
      query,
      variables
    }, accessToken);

    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'GraphQL error');
    }
    
    return { data: response.data as T, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

