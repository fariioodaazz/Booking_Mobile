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

export const SEARCH_USER_BY_NU_ID = gql`
  query SearchUserByNuId($nuId: Int!) {
    searchUserByNuId(nuId: $nuId) {
      nuId
      name
      message
      isEligible
    }
  }
`;


export const CREATE_QUICK_LIST = gql`
  mutation CreateQuickList($name: String!, $nuIds: [Int!]!) {
    createQuickList(name: $name, nuIds: $nuIds) {
      success
      quickList {
        id
        name
        owner {
          name
          email
          nuId
        }
        users {
          name
          email
          nuId
        }
      }
    }
  }
`;

export const UPDATE_QUICK_LIST = gql`
  mutation UpdateQuickList($quicklistId: ID!, $nuIds: [Int!]!, $addUsers: Boolean!) {
    quickListUpdate(quicklistId: $quicklistId, nuIds: $nuIds, addUsers: $addUsers) {
      success
      quickList {
        id
        name
        owner {
          name
          email
          nuId
        }
        users {
          name
          email
          nuId
        }
      }
    }
  }
`;