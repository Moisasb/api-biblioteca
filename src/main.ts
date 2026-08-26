import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Ativda a validação dos DTOs em toda a aplicação.
  app.useGlobalPipes(
    new ValidationPipe({
      // Remove a propriedade que não existe no DTO
      whitelist: true,
      // Retorna o erro quando uma propriedade desconhecida é enviada.
      forbidNonWhitelisted: true,
      // Tenta transformar os valores recebidos
      // para os tipos esperados pela aplicação
      transform: true
    })
  );
  // Realizará de forma dinâmica, a criação da documentação para a nossa API
  const config = new DocumentBuilder()
  .setTitle('API Biblioteca') // Título do documento
  .setDescription('API para gerenciamento da biblioteca') // Descrição
  .setVersion('1.0') // Versão do documento
  .addBearerAuth()
  .build() // Comando para construção
  const documento = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api_biblioteca', app, documento);

  app.enableCors()

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
