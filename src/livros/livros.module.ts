import { Module } from '@nestjs/common';
import { LivrosController } from './livros.controller';
import { LivrosService } from './livros.service';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  // Importamos o DatabaseModule porque o livrosService precisará acessar o banco.
  imports: [DatabaseModule, AuthModule],
  controllers: [LivrosController],
  providers: [LivrosService]
})
export class LivrosModule {}
