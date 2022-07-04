import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user/schema/user.schema';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';
import { Post, PostSchema } from './schema/post.schema';

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: User.name,
				schema: UserSchema,
			},
			{
				name: Post.name,
				schema: PostSchema,
			},
		]),
		JwtModule.register({
			secret: process.env.SECRET_JWT || '@f7LMw&F}$aPa/n`_c3&jkL*:V?Qf',
		}),
	],
	providers: [PostResolver, PostService],
})
export class PostModule {}
