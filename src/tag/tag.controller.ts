import { Body, Controller, Get, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { TagService } from './tag.service';
import { Response } from 'express';
import { TagDto } from './dto/tag.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { AdminGuard } from 'src/auth/auth.admin.guard';

@ApiTags('tag')
@Controller('tag')
export class TagController {
    constructor(
        private tagService: TagService
    ){}

    @ApiBearerAuth()
    @Post()
    @ApiResponse({status: 201, description: 'add successfully'})
    @ApiResponse({status: 409, description: 'tag already exists'})
    @ApiResponse({status: 400, description: 'error'})
    @UseGuards(AuthGuard, AdminGuard)
    async addTag(@Body() tagDto: TagDto, @Res() res: Response) {
        try {
            const newTag = await this.tagService.addTag(tagDto);

            return res.status(HttpStatus.CREATED).json({
                code: HttpStatus.CREATED,
                message: 'Tag added successfully',
                data: newTag
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                code: HttpStatus.BAD_REQUEST,
                message: error.message,
            });  
        }
    }

    @Get()
    @ApiResponse({status: 200, description: 'successfully'})
    @ApiResponse({status: 400, description: 'error'})
    async getAllTag(@Res() res: Response) {
        const listTags = await this.tagService.getAllTag();
        return res.status(HttpStatus.OK).json({
            code: HttpStatus.OK,
            message: 'Successfully!',
            data: listTags
        });
    }
    
}
