import { IsInt, IsString, IsNotEmpty, IsPositive} from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateAutorDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Augusto Cury',
        description: 'Autor do livro'
    })
    nome: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Brasileiro',
        description: 'Nacionalidade do autor'
    })
    nacionalidade: string;

    @IsInt()
    @IsPositive()
    @ApiProperty({
        example: '1999',
        description: 'Ano de nascimento do autor'
    })
    ano_nascimento: number;
}