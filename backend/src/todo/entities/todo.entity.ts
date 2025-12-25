import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Todo {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  title: string;

  @Field(() => Boolean)
  isCompleted: boolean;

  @Field(() => Int)
  importance: number; 

  @Field(() => Int)
  urgency: number;
}