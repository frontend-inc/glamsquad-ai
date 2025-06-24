// Simplified types for createTicket
interface CreateTicketParams {
  customer: {
    name: string;
    email: string;
  };
  bodyHtml: string;
  bodyText: string;
}

const GORGIAS_API_URL = process.env.GORGIAS_API_URL || 'https://glamsquid.gorgias.com';
const GORGIAS_USERNAME = process.env.GORGIAS_USERNAME;
const GORGIAS_API_TOKEN = process.env.GORGIAS_API_TOKEN;
const GORGIAS_TO_EMAIL = process.env.GORGIAS_TO_EMAIL || 'help@glamsquad.com';
const GORGIAS_TO_NAME = process.env.GORGIAS_TO_NAME || 'Help';

if (!GORGIAS_USERNAME || !GORGIAS_API_TOKEN) {
  throw new Error('Missing Gorgias credentials. Please ensure GORGIAS_USERNAME and GORGIAS_API_TOKEN are set in your environment variables.');
}

// Create base64 encoded credentials for Basic Auth
const credentials = Buffer.from(`${GORGIAS_USERNAME}:${GORGIAS_API_TOKEN}`).toString('base64');

class GorgiasClient {
  private baseUrl: string;
  private headers: HeadersInit;

  constructor() {
    this.baseUrl = GORGIAS_API_URL;
    this.headers = {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }

  async createTicket(params: CreateTicketParams) {
    const url = `${this.baseUrl}/api/tickets`;
    
    // Build the full ticket data with static values
    const ticketData = {
      customer: {
        email: params.customer.email,
        name: params.customer.name
      },
      messages: [
        {
          channel: "email",
          from_agent: true,
          public: true,
          source: {
            type: "api",
            from: {
              name: params.customer.name,
              address: params.customer.email
            },
            to: [
              {
                name: GORGIAS_TO_NAME,
                address: GORGIAS_TO_EMAIL
              }
            ]
          },
          via: "aircall",
          body_html: params.bodyHtml,
          body_text: params.bodyText
        }
      ],
      priority: "normal",
      spam: false,
      status: "open",
      via: "aircall",
      from_agent: false
    };
    
    const response = await fetch(url, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(ticketData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Gorgias API error: ${response.status} - ${error}`);
    }

    return response.json();
  }
}

export const gorgiasClient = new GorgiasClient();
export default gorgiasClient;
export type { CreateTicketParams };