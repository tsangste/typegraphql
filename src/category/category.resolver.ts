import { Resolver, Mutation, Arg, Query, Ctx } from 'type-graphql'
import { Category } from './category.type'
import { CategoryInput } from './category.input'
import { Db, ObjectID } from 'mongodb'

@Resolver()
export class CategoryResolver {

  @Query(_returns => Category, { nullable: false })
  async returnSingleCategory(@Arg('id') id: string, @Ctx() { db }: { db: Db }) {
    const result = await db.collection('categories').findOne({ _id: new ObjectID(id) })
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
  async returnAllCategories(@Ctx() { db }: { db: Db }) {
    const results = await db.collection('categories').find().toArray()

    return results.map(({ _id, ...category }) => ({
      id: _id,
      ...category
    }))
  }

  @Mutation(() => Category)
  async createCategory(@Arg('data') {
    name,
    description
  }: CategoryInput, @Ctx() { db }: { db: Db }): Promise<Category> {
    const response = await db.collection('categories').insertOne({ name, description })
    const { _id, ...category } = response.ops[0]

    return ({
      id: _id,
      ...category
    })
  }

  @Mutation(() => Boolean)
  async deleteCategory(@Arg('id') id: string, @Ctx() { db }: { db: Db }) {
    await db.collection('categories').deleteOne({ _id: id })
    return true
  }
}
