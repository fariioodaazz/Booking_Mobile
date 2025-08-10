import { useQuery, QueryHookOptions } from "@apollo/client";
import { MY_BOOKINGS } from "../graphql/queries.gql";

export const useMyBookings = (opts?: QueryHookOptions) =>
  useQuery(MY_BOOKINGS, opts);
