import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from '../services/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get("data")
  root() {
    console.log("data fetched successfully")
    return {
      message: 'Welcome to sandyMart!',
    };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<string> {
    const result = await this.appService.uploadImageToCloudinary(file);
    return result.url;
  }
}
