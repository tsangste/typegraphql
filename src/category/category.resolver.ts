import { Resolver, Mutation, Arg, Query } from 'type-graphql'
import { Db, ObjectID } from 'mongodb'
import { Inject, Service } from 'typedi'

import { Category } from './category.type'
import { CategoryInput } from './category.input'

@Service()
@Resolver()
export class CategoryResolver {

  constructor(@Inject('db') private db: Db) {}

  @Query(_returns => Category, { nullable: false })
  async returnSingleCategory(@Arg('id') id: string) {
    const result = await this.db.collection('categories').findOne({ _id: new ObjectID(id) })
    if (!result) {
      return {}
    }

    const { _id, ...category } = result

    return ({
      id: _id,
      ...category
    })
  }

  @Query(() => [Category])
  async returnAllCategories() {
    const results = await this.db.collection('categories').find().toArray()

    return results.map(({ _id, ...category }) => ({
      id: _id,
      ...category
    }))
  }

  @Mutation(() => Category)
  async createCategory(@Arg('data') {
    name,
    description
  }: CategoryInput): Promise<Category> {
    const response = await this.db.collection('categories').insertOne({ name, description })
    const { _id, ...category } = response.ops[0]

    return ({
      id: _id,
      ...category
    })
  }

  @Mutation(() => Boolean)
  async deleteCategory(@Arg('id') id: string) {
    await this.db.collection('categories').deleteOne({ _id: id })
    return true
  }
}
