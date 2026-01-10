import { Controller, Get, Param, Res, NotFoundException } from '@nestjs/common';
import { MediaService } from './media.service';
import { Response } from 'express';

@Controller('media')
export class MediaController {
    constructor(private readonly mediaService: MediaService) { }

    @Get(':id')
    async getFile(@Param('id') id: string, @Res() res: Response) {
        const file = await this.mediaService.getFile(id);
        if (!file) {
            throw new NotFoundException('File not found');
        }

        res.set({
            'Content-Type': file.mimetype,
            'Content-Disposition': `inline; filename="${file.filename}"`,
        });

        res.send(file.data);
    }
}
