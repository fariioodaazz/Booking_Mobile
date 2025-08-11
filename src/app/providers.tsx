import React from "react";
import { ApolloProvider } from "@apollo/client";
import { ThemeProvider } from "styled-components/native";
import { apolloClient } from "../lib/apollo/client";
import { theme } from "../shared/styles/theme";

export const AppProviders =  ({ children }: React.PropsWithChildren)  => {
  // quick sanity check while debugging:
  console.log("apolloClient is", apolloClient);
  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ApolloProvider>
  );
};
