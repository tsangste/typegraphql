import { ObjectType, Field, ID } from 'type-graphql'

@ObjectType({ description: 'The Categories model' })
export class Category {
  @Field(() => ID)
  id: string

  @Field()
  name: string

  @Field()
  description: string
}
