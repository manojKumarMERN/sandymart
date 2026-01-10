import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Media, MediaDocument } from './schemas/media.schema';
import { Readable } from 'stream';

@Injectable()
export class MediaService {
    constructor(@InjectModel(Media.name) private mediaModel: Model<MediaDocument>) { }

    async uploadFile(file: Express.Multer.File): Promise<string> {
        const newFile = new this.mediaModel({
            filename: file.originalname,
            mimetype: file.mimetype,
            data: file.buffer,
        });
        const savedFile = await newFile.save();
        return `${process.env.j}/api/media/${savedFile._id}`;
    }

    async uploadImage(file: Express.Multer.File): Promise<any> {
        // Adapter to match CloudinaryService interface if needed, 
        // or just direct implementation.
        const url = await this.uploadFile(file);
        return {
            secure_url: url,
            public_id: url.split('/').pop(),
        };
    }

    async getFile(id: string): Promise<MediaDocument | null> {
        return this.mediaModel.findById(id).exec();
    }

    // Helper for multiple images compatibility
    async uploadImages(images: string[]): Promise<string[]> {
        // Since we are moving to local DB, "uploading from URL" implies downloading and saving.
        // This function mimics the Cloudinary one but stores in DB.
        const uploadPromises = images.map(async (imageUrl) => {
            try {
                const response = await fetch(imageUrl);
                const arrayBuffer = await response.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const newFile = new this.mediaModel({
                    filename: 'imported-image.jpg', // Default or parse from URL
                    mimetype: response.headers.get('content-type') || 'image/jpeg',
                    data: buffer,
                });
                const savedFile = await newFile.save();
                // TODO: Use correct Environment variable for host
                return `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/media/${savedFile._id}`;
            } catch (error) {
                console.error('Error uploading image from URL:', error);
                return null;
            }
        });

        const results = await Promise.all(uploadPromises);
        return results.filter(url => url !== null) as string[];
    }

    async uploadBuffer(buffer: Buffer): Promise<string> {
        const newFile = new this.mediaModel({
            filename: 'buffer-upload.jpg',
            mimetype: 'image/jpeg', // Defaulting as we don't know
            data: buffer
        });
        const savedFile = await newFile.save();
        return `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/media/${savedFile._id}`;
    }
}
