export const QUERY_MARKETS = `
{
  markets {
    id
    name
    abbreviation
    shortName
    isEnabled
  }  
}`;

export const QUERY_MARKETS_EXTENDED = `
{
  markets {
    id
    name
    abbreviation
    shortName
    isEnabled
    timezone
    regions
    cancellationPolicy
    serviceTax
    productTax
    tip
    handlingFee
    priority
    minimumAdvanceBookingMinutes
    cutoffTime
    resumeTime
    latitude
    longitude
    firstAppointmentTime
    lastAppointmentTime
    isAvailabilitySearchSquadEnabled
    isAvailabilitySearchOnlySquadEnabled
    squadSearchPriceDifferential
    mapProvider
    limitedAvailabilityServiceTypeIds
    createdAt
    updatedAt
  }
}`;
