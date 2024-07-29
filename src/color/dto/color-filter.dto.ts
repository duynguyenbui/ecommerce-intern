import { ApiProperty } from "@nestjs/swagger";

export class ProductColorFilterDto {
    @ApiProperty()
    variantId: number
}