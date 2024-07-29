import { Body, Controller, HttpStatus, Param, Post, Put, Query, Res, UploadedFile, UploadedFiles, UseGuards, UseInterceptors  } from '@nestjs/common';
import { VariantService } from './variant.service';
import { VariantDto } from './dto/variant.dto';
import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { AdminGuard } from 'src/auth/auth.admin.guard';

@ApiBearerAuth()
@ApiTags('variant')
@Controller('variant')
export class VariantController {
    constructor(
        private variantService: VariantService
    ){}

    @Post()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
		schema: {
			type: 'object',
			properties: {
				SKU: { type: 'string'},
				price: { type: 'number'},
				stock_quantity: { type: 'number' },
				material: { type: 'number' },
                colorId: { type: 'number' },
                sizeId: { type: 'number' },
                productId: { type: 'number' },
				files: {
					type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    }
				},
			},
			required: ['SKU', 'price', 'stock_quantity', 'material', 'colorId', 'sizeId', 'productId', 'files'],
		},
	})
    @ApiResponse({status: 200, description: 'successfully'})
    @ApiResponse({status: 400, description: 'error'})
    @UseGuards(AuthGuard, AdminGuard)
    @UseInterceptors(FilesInterceptor('files', 5))
    async addProduct(
        @UploadedFiles() files: Express.Multer.File[],
        @Body() variantDto: VariantDto,
        @Res() res: Response
    ){
        try {
            const newProductVariant = await this.variantService.addProductVariant(variantDto, files);
            return res.status(HttpStatus.CREATED).json({
                code: HttpStatus.CREATED,
                message: 'Added successfully',
                data: newProductVariant
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                code: HttpStatus.BAD_REQUEST,
                message: error.message,
            });    
        }
    }

    @Put(':id')
    @ApiResponse({status: 200, description: 'successfully'})
    @ApiResponse({status: 404, description: 'Variant not found'})
    @ApiResponse({status: 400, description: 'error'})
    @UseGuards(AuthGuard, AdminGuard)
    // @UseInterceptors(FilesInterceptor('files', 5))
    async updateProductVariant(
        // @UploadedFiles() files: Express.Multer.File[],
        @Param('id') id: string, 
        @Body() variantDto: VariantDto,
        @Res() res: Response
    ) {
        try {
            const result = await this.variantService.updateProductVariant(Number(id), variantDto);
                return res.status(HttpStatus.OK).json({
                    code: HttpStatus.CREATED,
                    message: 'Updated successfully',
                    data: result
                });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                code: HttpStatus.BAD_REQUEST,
                message: error.message,
            });  
        }
    }
}
