import { Controller, Get, HttpStatus, Param, Query, Req, Res, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserFilterDto } from './dto/user-filter.dto';
import { Response } from 'express';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AdminGuard } from 'src/auth/auth.admin.guard';

@ApiTags('user')
@Controller('user')
export class UserController {
    
    constructor(private userService: UserService){}

    @ApiBearerAuth()
    @ApiResponse({status: 200, description: 'successfully'})
    @ApiResponse({status: 400, description: 'error'})
    @Get()
    @UseGuards(AuthGuard, AdminGuard)
    async getAllUser(@Res() res: Response, @Query() query: UserFilterDto) {
        try {
            const listUser = await this.userService.getAllUser(query);
            return res.status(HttpStatus.OK).json({
                code: HttpStatus.OK,
                message: 'List user',
                data: listUser
            });
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                code: HttpStatus.BAD_GATEWAY,
                message: error.message
            });
        }
    }
    
    @Get('token')
    @UseGuards(AuthGuard)
    @ApiResponse({status: 200, description: 'successfully'})
    @ApiResponse({status: 400, description: 'error'})
    async getOneCustomer(@Param('id') id: string, @Res() res: Response, @Req() req: Request): Promise<any> {
        const user = req['user'];
        const result = await this.userService.getOneUser(Number(user.id));
        return res.status(HttpStatus.OK).json({
            code: HttpStatus.OK,
            data: result
            });
    }
}
