import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ColorDto {

    @ApiProperty()
    @IsNotEmpty()
    name: string;
}