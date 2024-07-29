import { forwardRef, Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { Order } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './entities/orderItem.entity';
import { Variant } from 'src/product/entities/variant.entity';
import { User } from 'src/users/entities/user.entity';
import { EmailModule } from 'src/email/email.module';
import { QueueModule } from 'src/queue/queue.module';
import { AppotaPayModule } from 'src/appota-pay/appota-pay.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem, Variant, User]),
    EmailModule, QueueModule, forwardRef(() => AppotaPayModule)
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService]
})
export class OrderModule {}
