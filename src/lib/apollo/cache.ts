import { InMemoryCache } from "@apollo/client";

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        myBookings: {
          merge(_, incoming) { return incoming; } 
        }
      }
    }
  }
});
