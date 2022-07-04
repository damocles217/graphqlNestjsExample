import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Error {
	@Field()
	message: string;

	@Field()
	path: string;
}
