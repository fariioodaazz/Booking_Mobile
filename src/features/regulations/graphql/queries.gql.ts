import { gql } from "@apollo/client";

export const REGULATIONS_PAGE_QUERY = gql`
  query RegulationsPage($facilityId: ID!) {
    facility(id: $facilityId) {
      id
      info
      category { category name }
      regulations { sections { title items } }
    }
    myBookingEligibility(facilityId: $facilityId) {
      eligible reasons remainingQuota suspendedUntil
    }
  }
`;
