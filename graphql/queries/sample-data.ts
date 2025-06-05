const marketId= {
  "marketId": "2d72eae4-93c7-4daf-a8dc-e64caa952615"
}

const addOnServiceIds = {
 "addonId": "0b9cb93d-9438-41c2-8f8d-bc20120577a2"
}

const serviceId = {
  "serviceId": "d228a139-b3e2-4581-b1c2-e6403ad06285"
}

const address = {  
  "address": {
    "street": "801 S Miami Ave",
    "apartment": "Unit 1201",
    "city": "Miami",
    "state": "FL",
    "zip": "33130",
    "type": "home"
  },
  "startDateTime": "2025-06-04T16:00:00.000Z",
  "baseServiceId": "d228a139-b3e2-4581-b1c2-e6403ad06285",
  "addOnServiceIds": []  
}

const me = {
  "data": {
    "me": {
      "id": "01795567-27cf-4dc8-a80d-776ef708f381",
      "addresses": [
        {
          "id": "c17ae980-c4b3-4639-99ab-872e6ef8da35"
        }
      ]
    }
  }
}

const bearerToken = {
  "Authorization": "Bearer oTxe/cRvOGaNT6CBY2JtdwwylJpl9veXyd3nbiQvA7oeviLCGv6TKz7HL1Ec9nGhm11LSiReKGvB4wR05b66aSSeZma30GDe8wlk++CKTW/ldDXPBJxp92uALXGGY9tYyjisRnuOcvU0fd0PWlLkvWnVBmYqDajPOjHkzSjKmxEjNTMU0eEWH8ylEPuOEmcvuyve+fCYoOlTW+MvSx1I7E3LrHiCT1R6H5Pi3JlN9p5nu32DcnRzXzJusKpWeoyIEw375M1g3ct3FnPnR6drntI7uTP4Ky2S2XJkspEsOMunCFLYs8/hoRTQ3zhVbYO6kwbd48+/+/I6c3Gbu1jqiRBY1Cqyka6/839LPgvYeL+bW0960kusnFk7hDdnwivPEYeWNY89F69PGWypcDJw5PS8sVGoF43Dj5x9Ll57kUA="
}

const messages = { 
  "messages": [{ 
    "role": "user",
    "content": "What markets are you in?"
  }]
}

const messages1 = { 
  "messages": [{ 
    "role": "user",
    "content": "What services do you offer?"
  }]
}


"Let's book the Makeup service for 3pm today. My address is 801 S Miami Ave, Unit 1201, Miami, FL 33130."


`
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

{
  "appointment": {
    "startDateTime": "2025-06-05T20:00:00.000Z",
    "timezone": "America/New_York",
    "totalPrice": 60.00,
    "finalPrice": 245.00,
    "bookingTokens": [
      "zXI1fgThcIZYUPcB6nPNUYzIUDWIDCWCB8XutsD/XqvCYijbOn0R+A0xgt7Xf1NpGr/MDhe0eY6Zq/5C6GLqNsQ+RTrxXi6p1AWS0xMZuQIp4juu2zYs79voLKfC4NjfMCddzzotH5RlqahgQgy8c3EKsQEKSEIbt6MCfq9gkLw+Q71GACl/WgigKGI70NkpbGfT9FciMyF9gcS8HYKC3W4VJp30pAhj3YppiMqoKVgjWtC+FoUHZ8g31baaft+iX2Il9T8X4FMZ5m+/36swFbc3E+z0A/wCB7l85NV+FpY5KHZOtc7sPS5DEPuX8ISpDIg6IIy725pLOQEzI8SWVANPTgKye75Hgt4rx0ikvJkQVYxWEcVXNwLQTubSfXFNX3q8FVGqkgUVSHODPqpcaxGfAaIyVy/w/X/e451BFtf8T2AUbCGOM8T60Tdsvdf3MjeU0Wz8FyLz3Xh44bEai4GIuOpg0G/DNpRPvQWzjY0dBMGsQ0XaCDkFZSRo5f2k5mCg/sLORp5Sn9AYWpME6jkkBkotjOJZqQkTUfEo7lI5NJMYOM855MMkpthBR7HqJvwQBw44+6K4KkOJVqjXd+sbGsjp9kE0iyggHhG4Nu9/mYuwEuVZxMDJsdTMp/U25BbPoEWyzk9FCn9SvxMQRATkmr75HWAJSXRr/QsHxqOzCl59EtV2iuI83e6J0XbjpX4zv2KrmM9psdBVbu1wuMIB3Oo5ndV10CceIUUR9VjpbjJ5m1a15+4WG3mdZVlOe9GHxas+kIUtpTiZ42illH5Aot9gMZ/fh6V+fLHQRefW6/v8rsIuc858pzTu54dspZDkxOmeCR3N9UcHy1am1cjALvRD7XLAcfmWqYjjNgFv+7/aZ1h+XEdP4RH6YQRPWtRZezMBqSknGhm5NYfRg/LPpOXHFERFmYEVD3ylwXMClvWNnw9FsbWUuDJ89btD6GfkoUizi13pvzKSpLPAURK5lU54po0UF9PvP3+JHkg="    
    ],
    "addressId": "c17ae980-c4b3-4639-99ab-872e6ef8da35",
    "ownerId": "01795567-27cf-4dc8-a80d-776ef708f381",
    "creatorId": "01795567-27cf-4dc8-a80d-776ef708f381"
  }
}

`