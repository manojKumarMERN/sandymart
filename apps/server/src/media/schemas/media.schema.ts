import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MediaDocument = Media & Document;

@Schema({ timestamps: true })
export class Media {
    @Prop({ required: true })
    filename!: string;

    @Prop({ required: true })
    mimetype!: string;

    @Prop({ required: true })
    data!: Buffer;
}

export const MediaSchema = SchemaFactory.createForClass(Media);
