const QUERY_SERVICES = `
query GetAllServices {
  services {
    id
    name
    description
    price
    duration
    image
    thumbnailImage

    # Add-on services relationships
    addOnServices {
      id
      name
      price
      duration
    }    
  }
}`

const QUERY_SERVICES_EXTENDED = `query GetAllServices {
  services {
    id
    name
    description
    price
    duration
    isPopular
    isAddOn
    isPureAddOn
    isCombined
    canBeSwapped
    combinedAddOnServiceCompositeId
    addOnName
    addOnDescription
    addOnPrice
    addOnDuration
    maxPerAppointment
    backToBackOnly
    firstTimeBooking
    image
    thumbnailImage
    instructionalImage
    infoHowToPrep
    infoWhatsIncluded
    infoTagline
    baseResourceUrl
    priority
    serviceTypeName
    parentAddOnServiceIds
    isDurationAdjustable
    isProviderPaymentAdjustable
    providerCommission
    archivedAt
    isInformational
    informationalPriceText
    informationalUrl
    maxTier
    availableWeekdays
    availableStartHour
    availableEndHour
    isFlatRate
    createdAt
    updatedAt
    serviceTypeId
    reportingServiceTypeId
    alternateServiceId
    
    # Related objects
    serviceType {
      id
      name
      priority
      serviceInfoTitle
      serviceInfoBody
      providerTitle
      squadSearchPriceDifferential
    }
    
    reportingServiceType {
      id
      name
    }
    
    alternateService {
      id
      name
    }
    
    # Add-on services relationships
    addOnServices {
      id
      name
      price
      duration
    }
    
    addOnParentServices {
      id
      name
      price
      duration
    }
  }
}`