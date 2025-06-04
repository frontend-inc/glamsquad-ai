const QUERY_SERVICES_BY_MARKET = `
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