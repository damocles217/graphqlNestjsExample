import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { FastifyReply } from 'fastify';
import { FastifyRequest } from 'fastify';
import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';

import { UserModule } from './user/user.module';

@Module({
	imports: [
		MongooseModule.forRoot('mongodb://127.0.0.1:27017/test'),
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
			sortSchema: true,
			playground: true,
			cors: {
				limit: '50mb',
				credentials: true,
				origin: 'http://192.168.1.67:5000',
				sameSite: 'strict',
			},
			context: ({
				req,
				reply,
			}): { req: FastifyRequest; reply: FastifyReply } => {
				return {
					req,
					reply,
				};
			},
		}),

		UserModule,
	],
})
export class AppModule {}
