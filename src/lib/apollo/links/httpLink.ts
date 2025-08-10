import { createHttpLink } from "@apollo/client";
import { getGraphqlUrl } from "../../env";

export const httpLink = createHttpLink({ uri: getGraphqlUrl() });
