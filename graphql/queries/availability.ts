
const availability = `query GetServiceAvailability(
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