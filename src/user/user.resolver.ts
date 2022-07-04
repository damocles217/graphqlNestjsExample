import { UseGuards } from '@nestjs/common';
import {
	Resolver,
	Query,
	Context,
	GraphQLExecutionContext,
	Mutation,
	Args,
	Int,
} from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';
import { FastifyReply } from 'fastify';
import { AuthGuard } from '../guards/auth.guard';
import { GetLoged } from './graphql/response.model';
import { LoginUserInput, NewUserInput } from './dto/user.input';
import { Response } from './graphql/response.model';
import { User } from './graphql/user.model';
import { UserService } from './user.service';

@Resolver(() => Response)
export class UserResolver {
	constructor(
		private userService: UserService,
		private jwtService: JwtService,
	) {}

	@Query((returns) => GetLoged)
	async isLoged(
		@Context() context: GraphQLExecutionContext,
	): Promise<GetLoged> {
		const req: FastifyRequest = context['req'];

		return await this.userService.isLoged(req);
	}

	@UseGuards(AuthGuard)
	@Query((returns) => [User])
	async getUsers(
		@Args({ name: 'limit', type: () => Int }) limit: number,
	): Promise<Array<User>> {
		return await this.userService.getUsers(limit);
	}

	// TODO complete this resolver
	@UseGuards(AuthGuard)
	@Query((returns) => Response)
	async getUser(
		@Args({ name: 'email', type: () => String }) email: string,
		@Context() context: GraphQLExecutionContext,
	): Promise<Response> {
		const req: FastifyRequest = context['req'];

		return this.userService.getUser(req, email);
	}
	//TODO create a DELETE resolver

	//TODO create a UPDATE resolver
	@UseGuards(AuthGuard)
	@Mutation((returns) => Response)
	async updateUser(
		@Args({ name: 'updateUser', type: () => NewUserInput }) user: NewUserInput,
		@Context() context: GraphQLExecutionContext,
	): Promise<Response> {
		return null;
	}

	@UseGuards(AuthGuard)
	@Query((returns) => Boolean)
	async logOut(@Context() context: GraphQLExecutionContext): Promise<boolean> {
		const req: FastifyRequest = context['req'];
		const res: FastifyReply = context['reply'];

		if (req['cookies']) {
			res['clearCookie']('c_user', {
				httpOnly: true,
				path: '/',
				sameSite: 'strict',
				// secure: true, // TODO set with https
			});

			res['clearCookie']('t_user', {
				httpOnly: true,
				path: '/',
				sameSite: 'strict',
				// secure: true, // TODO set with https
			});

			return true;
		}

		return false;
	}

	@Mutation((returns) => Response)
	async loginUser(
		@Context() context: GraphQLExecutionContext,
		@Args({ name: 'loginInput', type: () => LoginUserInput })
		loginInput: LoginUserInput,
	): Promise<Response> {
		const res: FastifyReply = context['reply'];

		const userResponse = await this.userService.loginUser(loginInput);

		if (userResponse.sucess) {
			const payload = {
				_id: userResponse.user._id,
				userId: userResponse.user.userId,
			};
			const jwtCreated = this.jwtService.sign(payload);

			res['setCookie']('c_user', userResponse.user.code_auth, {
				httpOnly: true,
				path: '/',
				sameSite: 'strict',
				// secure: true, // TODO set with https
			});

			res['setCookie']('t_user', jwtCreated, {
				httpOnly: true,
				path: '/',
				sameSite: 'strict',
				// secure: true, // TODO set with https
			});
		}

		return userResponse;
	}

	@Mutation((returns) => Response)
	async createUser(
		@Context() context: GraphQLExecutionContext,
		@Args({ name: 'userInput', type: () => NewUserInput })
		userInput: NewUserInput,
	): Promise<Response> {
		const res: FastifyReply = context['reply'];

		const userResponse = await this.userService.createUser(userInput);

		if (userResponse.sucess) {
			const payload = {
				_id: userResponse.user._id,
				userId: userResponse.user.userId,
			};
			const jwtCreated = this.jwtService.sign(payload);

			res['setCookie']('c_user', userResponse.user.code_auth, {
				httpOnly: true,
				path: '/',
				sameSite: 'strict',
				// secure: true, // TODO set with https
			});

			res['setCookie']('t_user', jwtCreated, {
				httpOnly: true,
				path: '/',
				sameSite: 'strict',
				// secure: true, // TODO set with https
			});
		}

		return userResponse;
	}
}
