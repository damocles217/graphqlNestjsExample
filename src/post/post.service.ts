import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/schema/user.schema';
import { Model, Document } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { Post as PostModel, PostDocument } from './schema/post.schema';
import { Post } from './graphql/post.model';
import { PostCreateInput } from './dto/post.input';
import { FastifyRequest } from 'fastify';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PostService {
	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>,
		@InjectModel(PostModel.name) private postModel: Model<PostDocument>,
		private jwtService: JwtService,
	) {}

	async createPost(req: FastifyRequest, post: PostCreateInput): Promise<Post> {
		const cookies = req['cookies'];
		const token = cookies.t_user;
		const code_auth = cookies.c_user;
		let user: User &
			Document<any, any, any> & {
				_id: any;
			};

		let posted: Post &
			Document<any, any, any> & {
				_id: any;
			};

		if (cookies) {
			const payload = this.jwtService.decode(token, { json: true });
			if (payload) {
				user = await this.userModel.findOne({
					code_auth,
					_id: payload['_id'],
					userId: payload['userId'],
				});
			}
			if (bcrypt.compareSync(post.password, user.password)) {
				posted = await this.postModel.create({
					title: post.title,
					description: post.description,
					content: post.content,
					owner: user.userId,
					facebook: post.facebook,
					updaters: [
						{
							updater: user.userId,
							dateUpdate: Date.now(),
						},
					],
				});

				return posted;
			}
		}
		return null;
	}

	async getPosts(list: number): Promise<Array<Post>> {
		const data = await this.postModel
			.find()
			.sort('-createdAt')
			.limit(5)
			.skip(list * 5);

		return data;
	}
}
