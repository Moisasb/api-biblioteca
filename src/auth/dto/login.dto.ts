import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({
        example: 'usuario@gmail.com',
        description: 'E-mail utilizado para realizar o login'
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        example: '123456',
        description: 'Senha do usuário'
    })
    @IsString()
    @IsNotEmpty({ message: 'A senha é obrigatória' })
    senha: string;
}