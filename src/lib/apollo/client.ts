import { ApolloClient, InMemoryCache, ApolloLink } from "@apollo/client";
import { httpLink } from "./links/httpLink";
import { authLink } from "./links/authLink";

export const apolloClient = new ApolloClient({
  link: ApolloLink.from([authLink, httpLink]),
  cache: new InMemoryCache(),
});
