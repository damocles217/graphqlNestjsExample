import { Error } from '../graphql/errors.model';

export function mergeErrors(e, otherErrors: Error[]): Error[] {
	let merger: Error[] = [];

	const errors = e.errors;
	if (errors) {
		Object.keys(errors).map((error) => {
			merger.push({
				path: errors[error].properties.path,
				message: errors[error].properties.message,
			});
		});
	}

	switch (e.code) {
		case 11000:
			{
				if (e.keyPattern.phone === 1) {
					merger.push({
						path: 'phone',
						message: 'Celular no valido',
					});
				} else
					merger.push({
						path: 'email',
						message: 'Correo no valido',
					});
			}
			break;
	}
	if (otherErrors) {
		merger = merger.concat(otherErrors);
	}

	return merger;
}

export const aleatoryCode = (): string => {
	const setLong = 30;
	const characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	let code = '';
	const max = characters.length - 1;
	for (let i = 0; i < setLong; i++) {
		code += characters[Math.floor(Math.random() * (max + 1))];
	}
	return code;
};
