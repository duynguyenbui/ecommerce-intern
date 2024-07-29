import { forwardRef, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { OrderService } from 'src/order/order.service';

@Injectable()
export class AppotaPayService {
  private apiKey: string;
  private secretKey: string;
  private partnerKey: string;

  constructor(
    private readonly configService: ConfigService,   
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => OrderService))
    private orderService : OrderService,
  ) {
    this.apiKey = this.configService.get<string>('APPOTAPAY_API_KEY');
    this.secretKey = this.configService.get<string>('APPOTAPAY_API_SECRETKEY');
    this.partnerKey = this.configService.get<string>('APPOTAPAY_PARTNER_CODE');
  }

  private createJWT(): string {
    const currentTimestamp = Math.floor(Date.now() / 1000); 
    const payload = {
      iss: this.partnerKey,
      jti: `${this.apiKey}-${currentTimestamp}`,
      api_key: this.apiKey,
    };
    return this.jwtService.sign(payload);
  }

  private ksort = (obj: any): any => {
    let keys = Object.keys(obj).sort();
    let sortedObj: any = {};
    
    for (let i in keys) {
      sortedObj[keys[i]] = obj[keys[i]];
    }
    return sortedObj;
  }

  private createSignature(data: string): string {
    return crypto.createHmac('sha256', this.secretKey).update(data).digest('hex');
  }

  async createTransaction(orderId: string, amount: number): Promise<any> {
    const url = 'https://payment.dev.appotapay.com/api/v2/orders/payment';
    
    const payload = {
      transaction: {
        amount: amount, 
        currency: "VND",
        bankCode: "",
        paymentMethod: "ATM",
        action: "PAY"
      },
      partnerReference: {
        order: {
          id: orderId,
          info: "Payment Order", 
          extraData: ""
        },
        notificationConfig: {
          notifyUrl: "http://localhost:4001/ipn",
          redirectUrl: "http://localhost:4001/appotapay/redirect",
          installmentNotifyUrl: "http://localhost:4001/appotapay/redirect"
        }
      }
    };

    const sortedKeys = this.ksort(payload);
    let signData = '';
    for (const [key, value] of Object.entries(sortedKeys)) {
      
      if (value !== null && value !== undefined) {
        signData += `&${key}=${encodeURIComponent(value.toString())}`;
      }
    }

    signData = signData.substring(1);
    
    const signature = this.createSignature(signData);

    payload['signature'] = signature;
    

    const jwt = this.createJWT();
    const headers = {
      'X-APPOTAPAY-AUTH': jwt,
      'Content-Type': 'application/json',
      'X-Language': 'vi'
    };

    try {
      const response = await axios.post(url, payload, { headers });
      return response.data;
    } catch (error) {
      console.log(error.response.data);
      
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  async processingReturnedResult(data: string, signature: string) {
    try {
      const decodeReturnedData = Buffer.from(data, 'base64').toString('utf-8');
      let jsonData: any;
      jsonData = JSON.parse(decodeReturnedData);
      if (jsonData.transaction.status === 'success') {
        return await this.orderService.processingReturnedResult(Number(jsonData.partnerReference.order.id))
      }    
      return { status: HttpStatus.BAD_GATEWAY, message: 'Payment fail' };
    } catch (error) {
      
      return { message: 'Invalid data' };
    }
  }
}
