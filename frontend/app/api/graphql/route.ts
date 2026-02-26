import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import typeDefs from "../../../lib/schema";
import resolvers from "../../../lib/resolvers";

export const dynamic = "force-dynamic"; // ✅ ADD THIS

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler(server);

export { handler as GET, handler as POST };