import { executeQuery } from "@/services/glamsquad/client";
import { MUTATION_CREATE_APPOINTMENT } from "@/graphql/mutations/appointments";
import { formatDate, formatAddress } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    // Check for access token in Authorization header
    const authHeader = req.headers.get('Authorization');
    const accessToken = authHeader?.replace('Bearer ', '');
    
    if (!accessToken) {
      return new Response(
        JSON.stringify({ 
          error: "Unauthorized: Access token required" 
        }), 
        { status: 401 }
      );
    }

    const { startDateTime, bookingTokens, addressId, userId } = await req.json();

    const createAppointmentData = await executeQuery(MUTATION_CREATE_APPOINTMENT, { 
      appointment: {
        startDateTime: startDateTime,
        bookingTokens: bookingTokens,
        addressId: addressId,
        creatorId: userId,
        ownerId: userId
      } 
    }, accessToken);

    if (!createAppointmentData?.data?.createAppointment) {
      return new Response(
        JSON.stringify({ 
          error: "Failed to create appointment" 
        }), 
        { status: 400 }
      );
    }

    const createdAppointment = createAppointmentData.data.createAppointment;
    const formattedStartDateTime = formatDate(createdAppointment.startDateTime);
    const fullAddress = formatAddress(createdAppointment.address);

    return new Response(
      JSON.stringify({
        message: `Appointment is scheduled for ${formattedStartDateTime} at ${fullAddress}.`,
        appointment: createdAppointment,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating appointment:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to create appointment" 
      }), 
      { status: 500 }
    );
  }
} 