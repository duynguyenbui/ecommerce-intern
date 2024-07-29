import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsInt, IsNotEmpty, Min } from "class-validator";

class ProductVariantDto {
    @ApiProperty()
    @IsInt()
    @Min(1)
    quantity: number;

    @ApiProperty()
    @IsNotEmpty()
    @Min(1)
    price: number;

    @ApiProperty()
    @IsInt()
    @Min(1)
    variantId: number;
}
export class OrderDto {

    @ApiProperty()
    @IsInt()
    @Min(1)
    quantity: number;
    
    @ApiProperty()
    @IsNotEmpty()
    total_price: number;

    @ApiProperty()
    @IsNotEmpty()
    payment_method: number;

    @ApiProperty({type: [ProductVariantDto]})
    @IsArray()
    @IsNotEmpty()
    orderData: ProductVariantDto[];
}