import { Field, InputType } from '@nestjs/graphql';

// For mutations
@InputType()
export class NewUserInput {
	@Field()
	name: string;

	@Field()
	lastname: string;

	@Field()
	email: string;

	@Field()
	password: string;
}

@InputType()
export class LoginUserInput {
	@Field()
	email: string;

	@Field()
	password: string;
}
