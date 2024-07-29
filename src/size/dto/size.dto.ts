import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class SizeDto {
    @ApiProperty()
    @IsNotEmpty()
    name: string;
}