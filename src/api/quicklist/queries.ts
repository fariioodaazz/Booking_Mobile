import { gql } from '@apollo/client';


export const GET_MY_QUICK_LISTS = gql`
  query my_quick_lists {
    myQuickLists {
      id
      name
      users {
        id
        name
        nuId
      }
    }
  }
`;