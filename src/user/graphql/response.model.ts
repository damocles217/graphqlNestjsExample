import { Field, ObjectType } from '@nestjs/graphql';
import { User } from './user.model';
import { Error } from './errors.model';

@ObjectType()
export class Response {
	@Field((type) => User, { nullable: true })
	user?: User;

	@Field()
	sucess: boolean;

	@Field((type) => [Error], { nullable: true })
	errors?: Error[];
}

@ObjectType()
export class GetLoged {
	@Field()
	log: boolean;

	@Field({ nullable: true })
	admin: boolean;
}
