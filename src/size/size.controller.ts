import { Body, Controller, Get, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { SizeService } from './size.service';
import { SizeDto } from './dto/size.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { AdminGuard } from 'src/auth/auth.admin.guard';

@ApiTags('size')
@Controller('size')
export class SizeController {
    constructor(
        private sizeService: SizeService
    ){}

    @ApiBearerAuth()
    @Post()
    @ApiResponse({status: 201, description: 'add successfully'})
    @ApiResponse({status: 409, description: 'size already exists'})
    @ApiResponse({status: 400, description: 'error'})
    @UseGuards(AuthGuard, AdminGuard)
    async addTag(@Body() sizeDto: SizeDto, @Res() res: Response) {
        try {
            const newSize = await this.sizeService.addSize(sizeDto);

            return res.status(HttpStatus.CREATED).json({
                code: HttpStatus.CREATED,
                message: 'Size added successfully',
                data: newSize
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
        const listSizes = await this.sizeService.getAllSize();
        return res.status(HttpStatus.OK).json({
            code: HttpStatus.OK,
            message: 'Successfully!',
            data: listSizes
        });
    }
}


