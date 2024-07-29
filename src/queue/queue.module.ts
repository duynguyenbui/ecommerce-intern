import { Module } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { ConsumerService } from './consumer.servie';
import { EmailModule } from 'src/email/email.module';

@Module({
    imports: [
        EmailModule
    ],
    providers: [ProducerService, ConsumerService],
    exports: [ProducerService],
})
export class QueueModule {}
