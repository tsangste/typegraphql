import express from 'express'
import { MongoClient as mongodb } from 'mongodb'
import 'reflect-metadata'
import { graphqlHTTP } from 'express-graphql'
import { Container } from 'typedi'
import { buildSchema } from 'type-graphql'

import { CategoryResolver } from './category/category.resolver'

mongodb.connect('mongodb://mongo:27017', { useNewUrlParser: true })
  .then(client => {
    const db = client.db('typegraphql')
    Container.set('db', db)

    return buildSchema({
      resolvers: [CategoryResolver],
      container: Container,
      emitSchemaFile: true,
      validate: false
    })
  })
  .then((schema) => {
    const app = express()

    app.use('/graphql', graphqlHTTP({
      schema: schema,
      graphiql: true
    }))

    const port = 4069
    app.listen(port, () => console.log('Deployment running on port: ', port))
    app.addListener('error', console.error)
  })
