import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { LoginUserInput, NewUserInput } from './dto/user.input';
import { Error } from './graphql/errors.model';
import { Response } from './graphql/response.model';
import { User as UserGQL } from './graphql/user.model';
import { User, UserDocument } from './schema/user.schema';
import { aleatoryCode, mergeErrors } from './configs/user.validate';
import * as bcrypt from 'bcrypt';
import { FastifyRequest } from 'fastify';
import { JwtService } from '@nestjs/jwt';
import { isValidUser } from '../guards/validation/authehtication';

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>,
		private jwtService: JwtService,
	) {}

	async getUsers(limit: number): Promise<Array<UserGQL>> {
		const users = await this.userModel.find();
		return users;
	}

	async createUser(userInput: NewUserInput): Promise<Response> {
		const otherErrors: Error[] = [];
		try {
			if (userInput.password.length < 10)
				otherErrors.push({
					message: 'La contraseña debe tener minimo 10 caracteres',
					path: 'password',
				});

			if (otherErrors.length > 0) throw otherErrors;
			const salt = 10;
			const match = await bcrypt.hash(userInput.password, salt);
			userInput.password = match;

			let code_auth = aleatoryCode();
			let counter = 0;
			let userId = `${userInput.name}.${userInput.lastname}`;
			userId = userId.toLocaleLowerCase();
			let checkedUser = await this.userModel.findOne({ userId });

			while (checkedUser) {
				checkedUser = await this.userModel.findOne({ userId });

				if (checkedUser) {
					counter++;
					if (counter < 2)
						userId = String.prototype.concat(userId, `${counter}`);
					else userId = userId.replace(/[0-9]+/, counter.toString());
				}
			}

			checkedUser = await this.userModel.findOne({ code_auth });
			while (checkedUser) {
				checkedUser = await this.userModel.findOne({ code_auth });
				if (checkedUser) code_auth = aleatoryCode();
			}

			const userNew = await this.userModel.create({
				...userInput,
				code_auth: code_auth,
				userId: userId,
			});

			await userNew.save();

			return {
				user: userNew,
				errors: null,
				sucess: true,
			};
		} catch (e) {
			return {
				user: null,
				errors: mergeErrors(e, otherErrors),
				sucess: false,
			};
		}
	}

	async loginUser(loginInput: LoginUserInput) {
		const otherErrors: Error[] = [];
		try {
			const userFinded = await this.userModel.findOne({
				email: loginInput.email,
			});

			if (bcrypt.compareSync(loginInput.password, userFinded.password)) {
				return {
					user: userFinded,
					errors: [],
					sucess: true,
				};
			}

			otherErrors.push({
				message: 'La contraseña es incorrecta',
				path: 'password',
			});

			if (otherErrors.length > 0) {
				throw otherErrors;
			}
		} catch (e) {
			return {
				user: null,
				errors: mergeErrors(e, otherErrors),
				sucess: false,
			};
		}
	}

	async isLoged(
		req: FastifyRequest,
	): Promise<{ log: boolean; admin: boolean }> {
		try {
			const cookies = req['cookies'];
			const token = cookies.t_user;
			const code_auth = cookies.c_user;
			let user: User &
				Document<any, any, any> & {
					_id: any;
				};

			const payload = this.jwtService.decode(token, { json: true });

			if (payload != null) {
				user = await this.userModel.findOne({
					_id: payload['_id'],
					userId: payload['userId'],
					code_auth: code_auth,
				});
				const loged = await isValidUser(req, this.userModel, this.jwtService);
				return {
					log: loged,
					admin: user.admin,
				};
			}
			return {
				log: false,
				admin: false,
			};
		} catch (e) {
			return {
				log: false,
				admin: false,
			};
		}
	}

	async getUser(req: FastifyRequest, email: string): Promise<Response> {
		const otherErrors: Error[] = [];
		try {
			const cookies = req['cookies'];
			const token = cookies.t_user;
			const code_auth = cookies.c_user;
			let payload = null;
			let user: User &
				Document<any, any, any> & {
					_id: any;
				};

			if (cookies) {
				payload = this.jwtService.decode(token, { json: true });

				if (payload) {
					user = await this.userModel.findOne({
						_id: payload['_id'],
						userId: payload['userId'],
						code_auth: code_auth,
					});
				}
			}

			if (user.admin) {
				const findedUser = await this.userModel.findOne({ email: email });
				return {
					user: findedUser,
					errors: null,
					sucess: true,
				};
			}
			otherErrors.push({
				message: 'Usted no tiene el nivel necesario para acceder aqui',
				path: 'admin',
			});
			throw otherErrors;
		} catch (e) {
			return {
				user: null,
				errors: mergeErrors(e, otherErrors),
				sucess: false,
			};
		}
	}
}
