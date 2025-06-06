import { GraphQLClient } from 'graphql-request';
import JSSHA from 'jssha';
import { get } from 'lodash';


interface ErrorType extends Error {
  res?: Response;
  body?: any;
}

export async function makeSignedRequest(method: string, endpoint: string, body?: any) {
  const apiUrl = process.env.GLAMSQUAD_API_URL
  const clientId = process.env.GLAMSQUAD_APP_ID
  const clientSecret = process.env.GLAMSQUAD_CLIENT_SECRET

  if (!clientId || !clientSecret || !apiUrl) {
    throw new Error('GLAMSQUAD_APP_ID, GLAMSQUAD_API_URL, and GLAMSQUAD_CLIENT_SECRET environment variables are required');
  }

  try {
    const sha = new JSSHA('SHA-256', 'TEXT');
    sha.setHMACKey(clientSecret, 'TEXT');
    sha.update([method, endpoint, JSON.stringify(body)].join('|'));
    const hmac = sha.getHMAC('B64');

    const url = apiUrl + endpoint;
    const glamToken = [clientId, hmac].join(':')

    const res = await fetch(url, {
      method,
      headers: {
        'Authorization': 'Glam ' + glamToken,
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

export async function executeQuery<T = any>(query: string, variables?: any): Promise<{ data: T | null; error: Error | null }> {
  try {
    const response = await makeSignedRequest('POST', '/graphql', {
      query,
      variables
    });
    
    if (response.errors) {
      throw new Error(response.errors[0]?.message || 'GraphQL error');
    }
    
    return { data: response.data as T, error: null };
  } catch (error) {
    return { data: null, error: error as Error };
  }
}

