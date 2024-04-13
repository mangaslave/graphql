"use strict";

import autoLoad from "@fastify/autoload";
import { join } from "desm";
import mercurius from "mercurius";
import { loaders, resolvers, schema } from "./graphQL.js";
import fastify from "fastify";

export async function buildServer(app) {
  app.register(autoLoad, {
    dir: join(import.meta.url, "plugins"),
  });

  app.register(mercurius, {
    schema,
    resolvers,
    loaders,
    graphiql: true,
    context: (request, reply) => ({ app })
  });
}
