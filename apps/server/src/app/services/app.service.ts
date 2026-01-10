import { BadRequestException, Injectable } from '@nestjs/common';
import { MediaService } from '@/media/media.service';

@Injectable()
export class AppService {
  constructor(private mediaService: MediaService) { }

  async uploadImageToCloudinary(file: Express.Multer.File) {
    // Retaining method name 'uploadImageToCloudinary' for compatibility if called elsewhere,
    // though it now uses MediaService. Consideration: Rename method in a major refactor.
    const result = await this.mediaService.uploadImage(file).catch(err => {
      console.error(err);
      throw new BadRequestException('Invalid file type.');
    });

    return result.secure_url;
  }
}
