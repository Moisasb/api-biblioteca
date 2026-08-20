import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseModule } from 'src/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from './auth.guard';

@Module({
  imports: [
    DatabaseModule,
    // irá configurar o módulo JWT utilizando as iniformações que somente estarão disponíveis quando a aplicação iniciar
    JwtModule.registerAsync({
      // para configurarmos o JWT, precisamos acessar as vartiaves do .ENV
      // fazemos atraves do ConfigService
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        // useFactory é a função responsavel por fazer/montar a configuração do JWT 
        secret: configService.get<string>('JWT_SECRET'),
        // busca a chave de seguramça que colocamos no .ENV para gerar o token
        signOptions: {
          expiresIn: '1h'
        }
      })
    })
  ],
  controllers: [AuthController, AuthGuard],
  providers: [AuthService, AuthGuard],
  exports: [JwtModule, AuthGuard]
})
export class AuthModule { }
