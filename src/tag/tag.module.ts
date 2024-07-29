import { Module } from '@nestjs/common';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { Tag } from 'src/product/entities/tag.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tag]),
  ],
  controllers: [TagController],
  providers: [TagService],
  exports: [TypeOrmModule]
})
export class TagModule {}
