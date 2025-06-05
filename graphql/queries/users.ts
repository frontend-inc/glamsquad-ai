export const QUERY_USER_BY_PHONE = `
  query CheckUserExists($phone: String!) {
    user(where: { phone: $phone }) {
      id
      email
      nameFirst 
      nameLast 
      phone
      createdAt
      addresses {
        id
        city
        state 
        street
        apartment
        zip
        type       
      }
      appointments {
        id 
        startDateTime
        endDateTime
        isCanceled        
        appointmentServices {
          service {
            id 
            name
            price
          }
        } 
      }
    }  
  }
  `;

  export const QUERY_USER_BY_EMAIL = `
  query CheckUserExists($email: String!) {
    user(where: { email: $email }) {
      id
      email
      nameFirst 
      nameLast 
      phone
      createdAt
      addresses {
        id
        city
        state 
        street
        apartment
        zip
        type       
      }
      appointments {
        id 
        startDateTime
        endDateTime
        isCanceled        
        appointmentServices {
          service {
            id 
            name
            price
          }
        } 
      }
    }  
  }
  `;