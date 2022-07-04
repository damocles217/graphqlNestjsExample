import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
	@Field((type) => ID)
	_id: string;

	@Field()
	name: string;

	@Field()
	lastname: string;

	@Field()
	email: string;

	@Field()
	password: string;

	@Field()
	userId: string;

	@Field()
	code_auth: string;

	@Field()
	admin: boolean;

	@Field((type) => Date, { nullable: true })
	createdAt?: Date;

	@Field((type) => Date, { nullable: true })
	updatedAt?: Date;
}
