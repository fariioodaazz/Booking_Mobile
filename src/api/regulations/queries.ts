import { gql } from "@apollo/client";

export const REGULATIONS_PAGE_QUERY = gql`

query RegulationsPage($categoryId:ID!) {
    category(id: $categoryId) {
    id
    name
    regulations {
      title
      items
    }
  }
    myGeneralEligibility {
      eligible
      reasons
      remainingQuota
      suspendedUntil
    }
  }

`;
