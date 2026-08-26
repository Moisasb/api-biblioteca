import { IsString, IsInt, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateAtorDto{
    @IsOptional()
    @IsString()
    @ApiPropertyOptional({
        example: 'Augusto Cury 2',
        description: 'Novo nome para autor'
    })
    nome?: string;

    @IsOptional()
    @IsString()
    @ApiPropertyOptional({
        example: 'Americano',
        description: 'Nova nacionalidade para autor'
    })
    nacionalidade?: string;

    @IsOptional()
    @IsInt()
    @ApiPropertyOptional({
        example: '1980',
        description: 'Novo ano de nascimento para autor'
    })
    ano_nascimento?: number;
}