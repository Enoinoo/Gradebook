import * as express from "express";
import { ApolloServer } from "apollo-server-express";
import { createServer } from "http";
import * as compression from "compression";
import * as cors from "cors";
import schema from "./schema";

const PORT = 3000;
const app = express();

const server = new ApolloServer({ schema });

app.use("*", cors());
app.use(compression());
server.applyMiddleware({ app, path: "/graphql" });

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen({ port: PORT }, (): void => {
  console.log(
    `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
  );
  console.log(
    `🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`
  );
});
