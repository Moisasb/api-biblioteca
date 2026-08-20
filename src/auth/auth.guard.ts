import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable() // Adicionado o decorator para que o NestJS possa injetar o JwtService
// Essa classe irá determinar se uma requisição pode continuar ou não
export class AuthGuard implements CanActivate {
    constructor(private readonly jwtservice: JwtService) { }

    // Função responsável por identificar o tipo de requisição e fornecer uma aprovação ou restrição de acesso
    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Recupera a requisição HTTP que está tentando acessar a rota (enviada pelo usuario)
        const request = context.switchToHttp().getRequest();

        // Recupera o conteúdo do cabeçalho Authorization (com a grafia correta em inglês)
        const authorization = request.headers.authorization;

        // Verifica se o authorization está presente no header da requisição
        if (!authorization) {
            throw new UnauthorizedException('Token não fornecido');
        }

        // Divide o cabeçalho pelo espaço para separar o Tipo (Bearer) e o Token
        const [tipo, token] = authorization.split(' ');

        if (tipo !== "Bearer" || !token) {
            throw new UnauthorizedException('Token inválido');
        }

        try {
            // Aqui validamos a assinatura e a validade do token (usando o "jwtservice" do construtor)
            const payload = await this.jwtservice.verifyAsync(token);
            // E salvamos as informações do usuário na requisição
            request.usuario = payload;
        } catch {
            // Caso não seja válido ou não esteja dentro do prazo, exibimos uma mensagem de 'erro'
            throw new UnauthorizedException('Token inválido ou expirado');
        }

        // Se tudo estiver correto, permitimos que a requisição continue.
        return true;
    }
}
