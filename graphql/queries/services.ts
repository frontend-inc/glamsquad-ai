export const QUERY_SERVICES_BY_MARKET = `
query GetServicesByMarket($marketId: String!) {
  marketServices(where: { marketId: $marketId, isHidden: false, isClientBookable: true }) {
    id    
    service {
      id 
      name 
      description 
      price 
      duration
    
      addOnServices {
        id
        name
        price
        duration
      }   
    }    
  }
}
`
export const QUERY_SERVICES_BY_MARKET_EXTENDED = `
query GetAvailableServicesByLocation($marketId: String!) {
  marketServices(where: { marketId: $marketId, isHidden: false, isClientBookable: true }) {
    id
    name
    description
    price
    duration
    isPopular
    isAddOn
    isPureAddOn
    serviceTypeName
    serviceTypeId
    isHidden
    isClientBookable
    isProBookable
    isDurationAdjustable
    isProviderPaymentAdjustable
    isFlatRate
    isInformational
    informationalPriceText
    informationalUrl
    addOnName
    addOnDescription
    addOnPrice
    addOnDuration
    maxPerAppointment
    backToBackOnly
    createdAt
    updatedAt
    
    # Get the full service details
    service {
      id
      name
      description
      price
      duration
      isPopular
      isAddOn
      isPureAddOn
      canBeSwapped
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
      priority
      isDurationAdjustable
      isProviderPaymentAdjustable
      providerCommission
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
      
      serviceType {
        id
        name
        priority
        serviceInfoTitle
        serviceInfoBody
        providerTitle
        squadSearchPriceDifferential
      }
      
      # Get add-on services
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
    
    # Get market information
    market {
      id
      name
      abbreviation
      shortName
      timezone
      regions
      serviceTax
      productTax
      tip
      handlingFee
      latitude
      longitude
    }
    
    # Get add-on market services
    addOnMarketServices {
      id
      name
      price
      duration
      isAddOn
      service {
        id
        name
        description
        price
        duration
      }
    }
  }
}
`

export const QUERY_SERVICES = `
query GetAllServices {
  services {
    id
    name
    description
    price
    duration
    image
    thumbnailImage
    isAddOn    

    # Add-on services relationships
    addOnServices {
      id
      name
      price
      duration
    }    
  }
}`

export const QUERY_SERVICES_EXTENDED = `query GetAllServices {
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