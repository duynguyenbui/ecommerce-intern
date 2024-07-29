import { Body, Controller, Get, HttpStatus, Param, Patch, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { OrderDto } from './dto/order.dto';
import { Response, Request } from 'express';
import { OrderService } from './order.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { OrderFilterDto } from './dto/order-filter.dto';
import { AdminGuard } from 'src/auth/auth.admin.guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('order')
@Controller('order')
export class OrderController {
    constructor(
        private orderService: OrderService
    ){}

    @Get('history')
    @ApiResponse({status: 200, description: 'successfully'})
    @ApiResponse({status: 400, description: 'error'})
    @UseGuards(AuthGuard)
    async getAllOrderHistory(@Res() res: Response, @Req() req: Request) {
        try {
            const user = req['user'];
            
            const OrderHistory = await this.orderService.getAllOrderHistory(Number(user.id));
            return res.status(HttpStatus.OK).json({
                code: HttpStatus.OK,
                message: 'Order History',
                data: OrderHistory
            });
        } catch (error) {
            console.error('Error fetching order history:', error);

            return res.status(HttpStatus.BAD_REQUEST).json({
                code: HttpStatus.BAD_GATEWAY,
                message: error.message
            });  
        }
    }

    @Post()
    @ApiResponse({status: 200, description: 'order Successfully'})
    @ApiResponse({status: 400, description: 'error'})
    @UseGuards(AuthGuard)
    async addOrder (
        @Body() orderDto: OrderDto,
        @Res() res: Response,   
        @Req() req: Request
    ) {
        try {
            const user = req['user'];
            const newProduct = await this.orderService.addOrder(orderDto, Number(user.id));
            
            return res.status(HttpStatus.CREATED).json({
                code: HttpStatus.CREATED,
                message: 'Order added successfully',
                data: newProduct
            });

        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                code: HttpStatus.BAD_REQUEST,
                message: error.message,
            });  
        }
    }

    @Patch(':id')
    @ApiResponse({status: 200, description: 'delete Successfully'})
    @ApiResponse({status: 400, description: 'error'})
    @UseGuards(AuthGuard)
    async deleteOrder(
        @Param('id') id: string,
        @Res() res: Response,
    ) {
        try {
            const is_Delete = await this.orderService.deleteOrder(Number(id));
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

    @Get()
    @ApiResponse({status: 200, description: 'successfully'})
    @ApiResponse({status: 400, description: 'error'})
    @UseGuards(AuthGuard, AdminGuard)
    async getAllOrder(@Res() res: Response,  @Query() query: OrderFilterDto) {
        try {
            const listOrder = await this.orderService.getAllOrder(query);
            return res.status(HttpStatus.OK).json({
                code: HttpStatus.OK,
                message: 'List order',
                data: listOrder
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
    @ApiResponse({status: 400, description: 'error'})
    @UseGuards(AuthGuard)
    async getOneOrder (@Res() res: Response, @Param('id') id: string) {
        try {
            const orderDetail = await this.orderService.getOneOrder(Number(id));
            return res.status(HttpStatus.OK).json({
                code: HttpStatus.OK,
                message: 'Order detail',
                data: orderDetail
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                code: HttpStatus.BAD_GATEWAY,
                message: error.message
            });
        }
    }

  

}
