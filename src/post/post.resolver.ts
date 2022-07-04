import { UseGuards } from '@nestjs/common';
import {
	Args,
	Context,
	GraphQLExecutionContext,
	Mutation,
	Query,
	Resolver,
} from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';
import { AdminGuard } from '../guards/admin.guard';
import { PostCreateInput } from './dto/post.input';
import { Post } from './graphql/post.model';
import { PostService } from './post.service';

@Resolver(() => Post)
export class PostResolver {
	constructor(
		private postService: PostService,
		private jwtService: JwtService,
	) {}

	@UseGuards(AdminGuard)
	@Mutation((returns) => Post)
	async createPost(
		@Args({ name: 'createPost', type: () => PostCreateInput })
		post: PostCreateInput,
		@Context() context: GraphQLExecutionContext,
	): Promise<Post> {
		const req: FastifyRequest = context['req'];

		return this.postService.createPost(req, post);
	}

	@Query((returns) => [Post])
	async getPosts(
		@Args({ name: 'list', type: () => Number }) list: number,
	): Promise<Array<Post>> {
		return await this.postService.getPosts(list);
	}
}
