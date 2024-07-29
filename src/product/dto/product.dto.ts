import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ProductDto {
    @ApiProperty()
    @IsNotEmpty()
    name: string;
    
    @ApiProperty()
    @IsNotEmpty()
    description: string;

    @ApiProperty()
    @IsNotEmpty()
    user_gender: string;

    @ApiProperty()
    @IsNotEmpty()
    categoryId: number;

    @ApiProperty({type: ['number']})
    @IsNotEmpty()
    tagId: number[];
}