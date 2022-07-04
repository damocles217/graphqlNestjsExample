import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { FastifyRequest } from 'fastify';
import { isValidUser } from './validation/authehtication';
import { User, UserDocument } from '../user/schema/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>,
		private jwtService: JwtService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const ctx = GqlExecutionContext.create(context);
		const { req }: { req: FastifyRequest } = ctx.getContext();

		return isValidUser(req, this.userModel, this.jwtService);
	}
}
