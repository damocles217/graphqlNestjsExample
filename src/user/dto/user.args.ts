import { ArgsType, Field, ID } from '@nestjs/graphql';

// For queries
@ArgsType()
export class RecipesArgs {
	@Field((type) => ID)
	_id: string;

	@Field()
	userId: string;
}
