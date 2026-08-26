import { Controller, Body, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
    constructor (private readonly authService:AuthService){}

    // Define o endpoint POST /auth/cadastro
    @Post('cadastro')
    @ApiOperation({
        summary: 'Cadastrar um novo usuário'
    })
    @ApiResponse({
        status: 201,
        description: 'Usuário cadastrado com sucesso'
    })
    @ApiResponse({
        status: 404,
        description: 'Não foi possível cadastrar o usuário'
    })
    cadastrar(@Body() createUsuarioDto:CreateUsuarioDto){
        return this.authService.cadastrar(createUsuarioDto);
    }

    // Define o endpoint POST /auth/login
    @Post('login')
    @ApiOperation({
        summary: 'Realizar login'
    })
    @ApiResponse({
        status: 201,
        description: 'Login realizado com sucesso'
    })
    @ApiResponse({
        status: 404,
        description: 'E-mail ou senha inválidos'
    })
    login(@Body() loginDto:LoginDto) {
        return this.authService.login(loginDto)
    }


}
