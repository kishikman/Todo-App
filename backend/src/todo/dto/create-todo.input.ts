import { InputType, Field, Int} from '@nestjs/graphql';

@InputType()
export class CreateTodoInput {
  @Field(() => String)
  title: string;

  @Field(() => Boolean, { nullable: true })
  isCompleted?: boolean;

  @Field(() => Int)
  importance: number;

  @Field(() => Int)
  urgency: number;
}