import { forwardRef, Module } from '@nestjs/common';
import { AppotaPayService } from './appota-pay.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppotaPayController } from './appota-pay.controller';
import { JwtModule } from '@nestjs/jwt';
import { OrderModule } from 'src/order/order.module';

@Module({
  imports:[
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.APPOTAPAY_API_SECRETKEY
    }),
    forwardRef(() => OrderModule)
  ],
  controllers: [AppotaPayController],
  providers: [AppotaPayService],
  exports: [AppotaPayService]
})
export class AppotaPayModule {}
