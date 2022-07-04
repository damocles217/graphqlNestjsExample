import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserResolver } from './user.resolver';
import { UserSchema, User } from './schema/user.schema';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { PostModule } from '../post/post.module';

@Module({
	imports: [
		PostModule,
		MongooseModule.forFeature([
			{
				name: User.name,
				schema: UserSchema,
			},
		]),
		JwtModule.register({
			secret: process.env.SECRET_JWT || '@f7LMw&F}$aPa/n`_c3&jkL*:V?Qf',
		}),
	],
	providers: [UserResolver, UserService],
})
export class UserModule {}
