export const MUTATION_CREATE_APPOINTMENT = `
mutation CreateAppointmentWithBookingToken($appointment: AppointmentInput!) {
  createAppointment(appointment: $appointment) {
    id
    startDateTime
    totalPrice
    finalPrice
    bookingTokens
    
    address {
      street
      city
      state
    }
    
    appointmentServices {
      id
      bookingToken
      service {
        name
      }
    }
  }
}
`