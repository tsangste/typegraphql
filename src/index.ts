import express from 'express'
import mongodb from 'mongodb'
import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'

import { CategoryResolver } from './category/category.resolver'

Promise.all([
  mongodb.connect('mongodb://mongo:27017', { useNewUrlParser: true }),
  buildSchema({
    resolvers: [CategoryResolver],
    emitSchemaFile: true,
    validate: false
  })
]).then(([client, schema]) => {
  const db = client.db('typegraphql')
  const server = new ApolloServer({
    schema,
    context: _ => ({ db })
  })

  const app = express()
  server.applyMiddleware({ app })

  const port = 4069
  app.listen(port, () => console.log('Deployment running on port: ', port))
  app.addListener('error', console.error)
})
