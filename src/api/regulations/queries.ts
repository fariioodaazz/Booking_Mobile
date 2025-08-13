import { gql } from "@apollo/client";

export const REGULATIONS_PAGE_QUERY = gql`

query RegulationsPage($category: FacilityCategoryGrapheneEnum!) {
    category(category: $category) {
      id
      name
      regulations { title items }
    }
    myGeneralEligibility {
      eligible
      reasons
      remainingQuota
      suspendedUntil
    }
  }

`;
