import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../../user/schema/user.schema';
import { UserResolver } from '../user.resolver';
import { UserModule } from '../../user/user.module';
import { UserService } from '../../user/user.service';

describe('UserController', () => {
	let userResolver: UserResolver;
	let userService: UserService;
	let userModule: UserModule;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [UserModule],
		})
			.overrideProvider(getModelToken(User.name))
			.useValue(jest.fn())
			.compile();

		userResolver = module.get<UserResolver>(UserResolver);
		userService = module.get<UserService>(UserService);
		userModule = module.get<UserModule>(UserModule);
	});

	it('Should be to define user module and dependencies', () => {
		expect(userResolver).toBeDefined();
		expect(userService).toBeDefined();
		expect(userModule).toBeDefined();
	});
});
