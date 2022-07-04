import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class PostCreateInput {
	@Field()
	title: string;

	@Field()
	description: string;

	@Field()
	content: string;

	@Field()
	password: string;

	@Field({ nullable: true })
	facebook?: string;
}
