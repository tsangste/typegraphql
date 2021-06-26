import express from 'express'
import { MongoClient as mongodb, Db } from 'mongodb'
import 'reflect-metadata'
import { ApolloServer } from 'apollo-server-express'
import { Container } from 'typedi'
import { buildSchema } from 'type-graphql'

import { CategoryResolver } from './category/category.resolver'

mongodb.connect('mongodb://mongo:27017', { useNewUrlParser: true })
  .then(client => {
    const db = client.db('typegraphql')
    Container.set(Db, db)

    return buildSchema({
      resolvers: [CategoryResolver],
      container: Container,
      emitSchemaFile: true,
      validate: false
    })
  })
  .then((schema) => {
    const server = new ApolloServer({ schema })

    const app = express()
    server.applyMiddleware({ app })

    const port = 4069
  app.listen(port, () => console.log('Deployment running on port: ', port))
  app.addListener('error', console.error)
})
