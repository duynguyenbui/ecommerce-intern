import { Controller, Get, HttpStatus, Query, Res } from '@nestjs/common';
import { AppotaPayService } from './appota-pay.service';
import { Response } from 'express';


@Controller('appotapay')
export class AppotaPayController {
  constructor(
    private readonly appotaPayService: AppotaPayService
  ) {}

  @Get('redirect')
  async paymentResult(
    @Query('data') data: string,
    @Query('signature') signature: string,
    @Res() res: Response
  ) {
    try {
      const result = await this.appotaPayService.processingReturnedResult(data, signature);
   
    return res.status(HttpStatus.CREATED).json({ result });
    } catch (error) {
      return res.status(HttpStatus.BAD_GATEWAY).json({ message: 'Payment fail'});
    }
  }

}
