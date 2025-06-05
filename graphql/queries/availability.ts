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
      providerName
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
      providerName
      providerPhotoUrl
      providerMatchScore
      isSquadSearch
      isMember
      bookingToken      
    }
    
  }
}`

const QUERY_AVAILABILITY_EXTENDED = `query GetServiceAvailability(
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
      providerName
      providerPhotoUrl
      providerMatchScore
      isSquadSearch
      isMember
      bookingToken
      
      # Service details
      service {
        id
        name
        description
        price
        duration
        image
        thumbnailImage
        serviceType {
          id
          name
        }
      }
      
      # Base service details
      baseService {
        id
        name
        description
        price
        duration
      }
      
      # Add-on services
      addOnServices {
        id
        name
        description
        price
        duration
        addOnPrice
        addOnDuration
      }
      
    }
    
    preferredAppointmentServices {
      id
      startDateTime
      providerName
      providerMatchScore
      service {
        id
        name
        price
      }
    }
  }
}`