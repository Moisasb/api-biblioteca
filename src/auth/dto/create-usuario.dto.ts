import { IsString, IsNotEmpty, IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUsuarioDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: 'Fernanda Nalon',
        description: 'Nome do usuário'
    })
    nome: string;

    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({
        example: 'fernanda@gmail.com',
        description: 'Email do usuario'
    })
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        example: "123abc",
        description: "Senha do usuário, precisa ser string"
    })
    senha: string;
}

