import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ versionKey: false, timestamps: true })
export class Post {
	@Prop({
		required: [true, 'El titulo es requerido'],
		trim: true,
	})
	title: string;

	@Prop({
		required: [true, 'La descripcion es requerido'],
		trim: true,
	})
	description: string;

	@Prop({
		required: [true, 'El contenido es requerido'],
		trim: true,
	})
	content: string;

	@Prop({
		trim: true,
	})
	owner: string;

	@Prop({
		unique: true,
	})
	updaters: { updater: string; dateUpdate: Date }[];

	@Prop({ required: false })
	facebook: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
