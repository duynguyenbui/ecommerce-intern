import { ApiProperty } from "@nestjs/swagger";

export class ProductFilterDto {

    @ApiProperty()
    page: number;

    @ApiProperty()
    items_per_page: number;

    @ApiProperty()
    search: string;

    @ApiProperty()
    categoryId: number;

    @ApiProperty()
    sizeId: number;
    
    @ApiProperty()
    colorId: number;

    @ApiProperty()
    from: number;

    @ApiProperty()
    to: number;
}