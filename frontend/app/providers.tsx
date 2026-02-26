"use client";

import type { ReactNode } from "react";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "/api/graphql",   // ✅ NOT localhost:4000
  }),
  cache: new InMemoryCache(),
});

export default function Providers({
  children,
}: {
  children: ReactNode;
}) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}