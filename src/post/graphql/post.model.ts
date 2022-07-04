import { Field, ObjectType, ID } from '@nestjs/graphql';

@ObjectType()
export class Post {
	@Field((type) => ID)
	_id: string;

	@Field()
	title: string;

	@Field()
	description: string;

	@Field()
	content: string;

	@Field()
	owner: string;

	@Field((type) => [Updaters])
	updaters: Updaters[];

	@Field((type) => Date, { nullable: true })
	createdAt?: Date;

	@Field((type) => Date, { nullable: true })
	updatedAt?: Date;

	@Field({ nullable: true })
	facebook?: string;
}

@ObjectType()
export class Updaters {
	@Field()
	updater: string;

	@Field((type) => Date)
	dateUpdate: Date;
}
