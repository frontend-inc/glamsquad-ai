import { executeQuery } from "@/services/glamsquad/client";
import { MUTATION_UPDATE_APPOINTMENT } from "@/graphql/mutations/appointments";

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

    const { appointmentId, cancellationReason } = await req.json();

    if (!appointmentId) {
      return new Response(
        JSON.stringify({ 
          error: "Appointment ID is required" 
        }), 
        { status: 400 }
      );
    }

    const appointmentData = await executeQuery(MUTATION_UPDATE_APPOINTMENT, { 
      appointmentId: appointmentId,
      appointment: {
        isCanceled: true,
        cancellationReason: cancellationReason || "Customer requested cancellation"
      } 
    }, accessToken);

    if (!appointmentData?.data?.updateAppointment) {
      return new Response(
        JSON.stringify({ 
          error: "Failed to cancel appointment" 
        }), 
        { status: 400 }
      );
    }

    const cancelledAppointment = appointmentData.data.updateAppointment;

    return new Response(
      JSON.stringify({
        message: "Appointment cancelled successfully",
        appointment: cancelledAppointment,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    return new Response(
      JSON.stringify({ 
        error: "Failed to cancel appointment" 
      }), 
      { status: 500 }
    );
  }
}