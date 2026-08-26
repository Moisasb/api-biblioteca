import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RowDataPacket } from 'mysql2';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    // Nos permite utilizar as regras ditadas pelo DTO
    constructor(private readonly databaseService: DatabaseService, private readonly jwtService: JwtService) { }

    async cadastrar(createUsuarioDto: CreateUsuarioDto) {
        // Primeiro vamos receber os dados (nome, email e senha) passadas pela regra do DTO
        const { nome, email, senha } = createUsuarioDto;

        // Aqui estamos gerando o Hash de senha
        // O número '10' representa o número de caminhos aos quais o hash usa pra construir a senha
        const senhaHash = await bcrypt.hash(senha, 10);

        // Salvamos o hash gerado, no banco de dados 
        // Não salvamos a senha original enviada pelo usuário
        await this.databaseService.query(
            `INSERT INTO usuario (nome, email, senha) VALUES (?,?,?)`, [nome, email, senhaHash]
        );

        // Este retorno é a confirmação de que a inserção dos dados no banco foi bem sucedida
        return {
            mensagem: 'Usuário cadastrado com sucesso'
        };
    }
    // Função responsável por buscar o usuário no banco através do e-mail e realizar as validações 
    async login(loginDto: LoginDto) {
        // Realiza a consulta no banco buscando todos os usuários com o email fornecido pelo usuario
        const resultado = await this.databaseService.query(
            'SELECT * FROM usuario WHERE email = ?', [loginDto.email]
        ) as RowDataPacket[];
        // testamos para ver se o usuário existe no banco, caso não exista, retornamos uma mensagem de 'erro'
        if (resultado.length === 0) {
            throw new UnauthorizedException('E-mail ou senha inválida')
        }
        // armazena o usuario encontrado dentro da constante 'usuario'
        const usuario = resultado[0];

        // agora vamos usuar o bcrypt.compare para testar se a senha informada pelo usuario para realizar o login, é a mesma usada para o login de cadastro
        const senhaValida = await bcrypt.compare(
            loginDto.senha, // senha de login
            usuario.senha // senha de cadastro
        );
        // Casoa senha fornecida não coincida com a senha registrada no cadastramento, retornamos uma mensagem de 'erro'
        if (!senhaValida) {
            throw new UnauthorizedException('E-mail ou senha invalidos')
        }

        // informações que serão armazenadas dentro do token (sendo neste cado o ID e o email do usuario). Nós não passamos a senha dele pelo token por questões de segurança
        const payload = {
            sub: usuario.id, // subject -> sujeito
            email: usuario.email // -> email
        }

        //  gera o JWT utilizando o payload e a chave configurada
        const token = await this.jwtService.signAsync(payload);

        // se tudo ocorreu bem até aqui, o login será realizado e junto, será gerado e exibido o token
        // lembrando que ele tem duração de 1h
        return {
            mensagem: 'Login realizado com sucesso',
            token: ''
        }
    }

}
