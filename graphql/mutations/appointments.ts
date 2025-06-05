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

export const MUTATION_UPDATE_APPOINTMENT = `
mutation UpdateAppointment($appointmentId: String!, $appointment: AppointmentInput!) {
  updateAppointment(id: $appointmentId, appointment: $appointment) {
    id
    startDateTime
    endDateTime
    isCanceled
    canceledAt
    cancellationInitiatedBy
    cancellationResolution
    totalPrice
    finalPrice
    creditsApplied
    
    address {
      street
      city
      state
      zip
    }
    
    owner {
      id
      nameFirst
      nameLast
      email
    }
    
    appointmentServices {
      id
      service {
        name
      }
      cancellationReason
      cancellationResolution
    }
  }
}`