import { Body, Controller, Get, HttpStatus, Param, Patch, Post, Put, Query, Res, UseGuards } from '@nestjs/common';

import { Response } from 'express';
import { ProductService } from './product.service';
import { ProductDto } from './dto/product.dto';
import { ProductFilterDto } from './dto/product-filter.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { AdminGuard } from 'src/auth/auth.admin.guard';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('product')
@Controller('product')
export class ProductController {
    constructor(
        private productService: ProductService
    ){}


    @ApiBearerAuth()
    @Post()
    @ApiResponse({status: 201, description: 'add successfully'})
    @ApiResponse({status: 400, description: 'error'})
    @UseGuards(AuthGuard, AdminGuard)
    async addProduct(
        @Body() productDto : ProductDto,
        @Res() res: Response
    ) {
        try { 
            const newProduct = await this.productService.addProduct(productDto);
            return res.status(HttpStatus.CREATED).json({
                code: HttpStatus.CREATED,
                message: 'Product added successfully',
                data: newProduct
            });
        } catch (error) {
        return res.status(HttpStatus.BAD_REQUEST).json({
                code: HttpStatus.BAD_REQUEST,
                message: error.message,
            });  
        }
    }

    @ApiBearerAuth()
    @Put(':id')
    @ApiResponse({status: 201, description: 'update successfully'})
    @ApiResponse({status: 404, description: 'product not found'})
    @ApiResponse({status: 400, description: 'error'})
    @UseGuards(AuthGuard, AdminGuard)
    async updateProduct (
        @Body() productDto : ProductDto,
        @Res() res: Response,
        @Param('id') id: string
    ) {
        try {
            const updateProduct = await this.productService.updateProduct(Number(id), productDto);
    
            return res.status(HttpStatus.CREATED).json({
                code: HttpStatus.CREATED,
                message: 'Update successfully',
                data: updateProduct
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                code: HttpStatus.BAD_REQUEST,
                message: error.message,
            });  
        }
    }

    @ApiQuery({name: 'page', required: false})
    @ApiQuery({name: 'items_per_page', required: false})
    @ApiQuery({name: 'search', required: false})
    @ApiQuery({name: 'categoryId', required: false})
    @ApiQuery({name: 'sizeId', required: false})
    @ApiQuery({name: 'colorId', required: false})
    @ApiQuery({name: 'from', required: false})
    @ApiQuery({name: 'to', required: false})
    @Get()
    @ApiResponse({status: 200, description: 'successfully'})
    @ApiResponse({status: 400, description: 'error'})
    async getAllProduct( @Res() res: Response, @Query() query: ProductFilterDto) {
        try {
            const listProduct = await this.productService.getAllProduct(query);
            return res.status(HttpStatus.OK).json({
                code: HttpStatus.OK,
                message: 'List product',
                data: listProduct
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                code: HttpStatus.BAD_GATEWAY,
                message: error.message
            });
        }
       
    }
    
    @Get(':id')
    @ApiResponse({status: 200, description: 'successfully'})
    @ApiResponse({status: 404, description: 'product not found'})
    @ApiResponse({status: 400, description: 'error'})
    async getOneProduct(
        @Param('id') id: string,
        @Res() res: Response
    ) {
        try {
        const productDetail = await this.productService.getOneProduct(Number(id));
        return res.status(HttpStatus.OK).json({
            code: HttpStatus.OK,
            message: 'Product detail: ',
            data: productDetail
        });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                code: HttpStatus.BAD_REQUEST,
                message: error.message,
            }); 
        }
    }

    @ApiBearerAuth()
    @Patch(':id')
    @UseGuards(AuthGuard, AdminGuard)
    @ApiResponse({status: 200, description: 'update Successfully'})
    @ApiResponse({status: 404, description: 'product not found'})
    @ApiResponse({status: 400, description: 'error'})
    async deleteOneProduct(
        @Res() res: Response,
        @Param('id') id: string,
    ) {
        try {
            const is_Delete = await this.productService.deleteOneProduct(Number(id));
            return res.status(HttpStatus.OK).json({
                code: HttpStatus.NO_CONTENT,
                message: 'Delete successfully ',
                data: is_Delete
            });
            } catch (error) {
                return res.status(HttpStatus.BAD_REQUEST).json({
                    code: HttpStatus.BAD_REQUEST,
                    message: error.message,
                }); 
            }
    }
    
}
