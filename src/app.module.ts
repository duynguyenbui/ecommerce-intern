import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product/product.module';
import { Product } from './product/entities/product.entity';
import { Variant } from './product/entities/variant.entity';
import { Thumbnail } from './product/entities/thumbnail.entity';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { Tag } from './product/entities/tag.entity';
import { TagModule } from './tag/tag.module';
import { VariantModule } from './variant/variant.module';
import { OrderModule } from './order/order.module';
import { Order } from './order/entities/order.entity';
import { OrderItem } from './order/entities/orderItem.entity';
import { CategoryModule } from './category/category.module';
import { Category } from './category/entities/category.entity';
import { SizeModule } from './size/size.module';
import { ColorModule } from './color/color.module';
import { Color } from './color/entities/color.entity';
import { Size } from './size/entities/size.entity';
import { EmailModule } from './email/email.module';
import { QueueModule } from './queue/queue.module';
import { AppotaPayModule } from './appota-pay/appota-pay.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
    type: process.env.TYPE as 'mysql',
    host: process.env.HOST,
    port: parseInt(process.env.PORT, 10),
    username: process.env.USER_NAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [User, Product, Variant, Thumbnail, Tag, Order, OrderItem, Category, Color, Size],
    synchronize: true,
  }),
  UserModule,
  AuthModule,
  ConfigModule,
  ProductModule,
  CloudinaryModule,
  TagModule,
  VariantModule,
  OrderModule,
  CategoryModule,
  SizeModule,
  ColorModule,
  EmailModule,
  QueueModule,
  AppotaPayModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
