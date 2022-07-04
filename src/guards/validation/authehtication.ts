import { UserDocument } from 'src/user/schema/user.schema';
import { JwtService } from '@nestjs/jwt';
import { FastifyRequest } from 'fastify';
import { Model } from 'mongoose';

export const isValidUser = async (
	req: FastifyRequest,
	userModel: Model<UserDocument>,
	jwtService: JwtService,
): Promise<boolean> => {
	const cookies = req['cookies'];
	const token = cookies.t_user;
	const code_auth = cookies.c_user;

	if (cookies) {
		const payload = jwtService.decode(token, { json: true });

		if (payload) {
			const user = await userModel.findOne({
				_id: payload['_id'],
				userId: payload['userId'],
				code_auth: code_auth,
			});

			return user ? true : false;
		}
	}
	return false;
};
