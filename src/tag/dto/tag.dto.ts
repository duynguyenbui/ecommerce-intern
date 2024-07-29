import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class TagDto {
    @ApiProperty()
    @IsNotEmpty()
    name: string;
}