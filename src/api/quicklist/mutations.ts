import { gql } from '@apollo/client';

// 🎯 DELETE QUICKLIST MUTATION - Using camelCase as GraphQL auto-converts

export const DELETE_QUICK_LIST = gql`
  mutation DeleteQuicklist($quicklistID: ID!) {
    deleteQuickList(quicklistID: $quicklistID) {
      success
      message
    }
  }
`;

