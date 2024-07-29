import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  orderId: string;

  @IsString()
  orderInfo: string;

  @IsNumber()
  amount: number;

  @IsString()
  bankCode: string;

  @IsString()
  paymentMethod: string;

  @IsString()
  notifyUrl: string;

  @IsString()
  redirectUrl: string;

  @IsString()
  action: string;

  @IsString()
  extraData: string;

  @IsString()
  currency: string;

  @IsString()
  signature: string;

  // @IsString()
  // clientIp: string;

}
