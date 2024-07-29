import { Body, Controller, Get, HttpStatus, Param, Post, Put, Res, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from './dto/category.dto';
import { Response } from 'express';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { AdminGuard } from 'src/auth/auth.admin.guard';

@ApiTags('category')
@Controller('category')
export class CategoryController {
    constructor (
        private categoryService : CategoryService
    ) {}

    @ApiBearerAuth()
    @Post()
    @ApiResponse({status: 201, description: 'add successfully'})
    @ApiResponse({status: 409, description: 'Category already exists'})
    @ApiResponse({status: 400, description: 'error'})
    @UseGuards(AuthGuard, AdminGuard)
    async addCategory (@Body() categoryDto: CategoryDto, @Res() res: Response) {
        try {
            const newCategory = await this.categoryService.addCategory(categoryDto);

            return res.status(HttpStatus.CREATED).json({
                code: HttpStatus.CREATED,
                message: 'Category added successfully',
                data: newCategory
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
    @ApiResponse({status: 201, description: 'Update Successfully'})
    @ApiResponse({status: 404, description: 'Category not found'})
    @ApiResponse({status: 400, description: 'error'})
    @UseGuards(AuthGuard, AdminGuard)
    async updateCategory ( 
        @Body() categoryDto: CategoryDto, 
        @Res() res: Response,
        @Param('id') id: string 
    ) {
        try {
            const newCategory = await this.categoryService.updateCategory(Number(id), categoryDto);

            return res.status(HttpStatus.CREATED).json({
                code: HttpStatus.CREATED,
                message: 'Category updated successfully',
                data: newCategory
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                code: HttpStatus.BAD_REQUEST,
                message: error.message,
            });  
        }
    }

    @Get()
    @ApiResponse({status: 200, description: 'Successfully'})
    @ApiResponse({status: 400, description: 'error'})
    async getAllCategory (@Res() res: Response) {
        const listCategories = await this.categoryService.getAllCategory();
        return res.status(HttpStatus.OK).json({
            code: HttpStatus.OK,
            message: 'Successfully!',
            data: listCategories
        });
    }
}
