import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
	NestFastifyApplication,
	FastifyAdapter,
} from '@nestjs/platform-fastify';
import fastifyCookie from 'fastify-cookie';

async function bootstrap() {
	try {
		const app = await NestFactory.create<NestFastifyApplication>(
			AppModule,
			new FastifyAdapter(),
		);

		app.register(fastifyCookie, {
			secret: 'mfdasl2!vp12@a[b04',
		});

		await app.listen(3000, '192.168.1.67');
	} catch (e) {
		console.log(e);
	}
}

bootstrap();
