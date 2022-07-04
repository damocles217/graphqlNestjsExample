import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ versionKey: false, timestamps: true })
export class User {
	@Prop({
		required: [true, 'El nombre es requerido'],
		trim: true,
	})
	name: string;

	@Prop({
		required: [true, 'El apellido es requerido'],
		trim: true,
	})
	lastname: string;

	@Prop({
		required: [true, 'El nombre es requerido'],
		trim: true,
		unique: true,
	})
	email: string;

	@Prop({
		required: [true, 'La contraseña es necesaria'],
		trim: true,
		unique: true,
	})
	password: string;

	@Prop({
		trim: true,
		unique: true,
	})
	userId: string;

	@Prop({
		unique: true,
	})
	code_auth: string;

	@Prop({
		default: false,
	})
	admin: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
