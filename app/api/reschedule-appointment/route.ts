import { NextResponse } from 'next/server';
import { executeQuery } from '@/services/glamsquad/client';
import { MUTATION_UPDATE_APPOINTMENT } from '@/graphql/mutations/appointments';

export async function POST(request: Request) {
  try {
    // Check for access token in Authorization header
    const authHeader = request.headers.get('Authorization');
    const accessToken = authHeader?.replace('Bearer ', '');
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'Unauthorized: Access token required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { appointmentId, startDateTime, bookingTokens, addressId } = body;

    if (!appointmentId || !startDateTime || !bookingTokens || !addressId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const appointmentData = await executeQuery(MUTATION_UPDATE_APPOINTMENT, {
      appointmentId: appointmentId,
      appointment: {
        startDateTime: startDateTime,
        bookingTokens: bookingTokens,
        addressId: addressId
      }
    }, accessToken);

    if (!appointmentData?.data?.updateAppointment) {
      return NextResponse.json(
        { error: 'Failed to reschedule appointment' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      appointment: appointmentData.data.updateAppointment
    });

  } catch (error) {
    console.error('Error rescheduling appointment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}