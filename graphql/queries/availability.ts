export const QUERY_AVAILABILITY_IN_TIME_RANGE = `
  query GetAvailabilityInTimeRange(
    $startDateTime: Date!
    $address: AddressInput!
    $baseServiceId: String!
    $addOnServiceIds: [String!]!
  ) {
  availableAppointmentServicesInTimeRange(
    startDateTime: $startDateTime
    timeStepCount: 24
    timeStep: 30
    address: $address
    baseServiceId: $baseServiceId
    addOnServiceIds: $addOnServiceIds
    limit: 24
  ) {
    appointmentServices {
      id
      startDateTime
      price
      duration
      bookingToken
    }
  }
}
`

export const QUERY_AVAILABILITY = `
query GetServiceAvailability(
  $startDateTime: Date!
  $address: AddressInput!
  $baseServiceId: String!
  $addOnServiceIds: [String!]!
  $limit: Int
) {
  
  availableAppointmentServices(
    startDateTime: $startDateTime
    address: $address
    baseServiceId: $baseServiceId
    addOnServiceIds: $addOnServiceIds
    limit: $limit
  ) {
    appointmentService {
      id
      startDateTime
      timezone
      duration
      customDuration
      price
      customPrice
      bookingToken      
    }    
  }
}`
