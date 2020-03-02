import { IResolvers } from "graphql-tools";
import { PubSub } from "apollo-server-express";

const pubsub = new PubSub();

const TOPIC = "infoTopic";

const infos = ["info1", "info2", "info3", "done"];

const publish = () => {
  setTimeout(
    () => infos.forEach(info => pubsub.publish(TOPIC, { info })),
    1000
  );
};

const resolvers: IResolvers = {
  Query: {
    getUser(): string {
      return "supposed to get user!";
    },
    go(): string {
      publish();
      return "going...";
    },
    populateUsers(): string {
      return "supposed to populate users";
    }
  },
  Mutation: {
    createUser(): string {
      return "supposed to create a user";
    }
  },
  Subscription: {
    info: {
      subscribe: () => pubsub.asyncIterator([TOPIC])
    }
  }
};

export default resolvers;
