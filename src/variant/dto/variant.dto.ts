import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, Min } from "class-validator";

export class VariantDto {

    @ApiProperty()
    @IsNotEmpty()
    SKU: string;

    @ApiProperty()
    @IsNotEmpty()
    price: number;

    @ApiProperty()
    @IsInt()
    @Min(0)
    stock_quantity: number;

    @ApiProperty()
    @IsNotEmpty()
    colorId: number;

    @ApiProperty()
    @IsNotEmpty()
    sizeId: number;

    @ApiProperty()
    @IsNotEmpty()
    material: string;

    @ApiProperty()
    @IsInt()
    @Min(0)
    productId: number;
}