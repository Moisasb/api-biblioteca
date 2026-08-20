import { Controller, Body, Post, Get, Param, ParseIntPipe, Put, Delete } from '@nestjs/common';
import { CreateLivroDto } from './dto/create-livro.dto';
import { LivrosService } from './livros.service';
import { updateLivroDto } from './dto/update-livro.dto';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';


// define o endpoint POST/Livros
@ApiTags('Livros') // Coloca uma Tag chamada "Livros"
@Controller('livros')
export class LivrosController {
    // Injetamos o LivrosService como dependência para o controller acessar
    constructor(private readonly livrosService: LivrosService) { }

    // Define o endpoint POST/livros
    @Post()
    // O ApiOperation serve para dizer a ação que o endpoint faz, qual o propósito dele.
    @ApiOperation({
        summary: 'Cadastrar um novo livro'
    })
    @ApiResponse({
        status: 201,
        description: 'Livro cadastrado com sucesso'
    })
    @ApiResponse({
        status: 404,
        description: 'Não foi possível cadastrar o livro'
    })
    @UseGuards(AuthGuard)
    criar(@Body() createLivroDto: CreateLivroDto) {
        // O @Body captura os dados enviados no corpo da requisição
        // O DTO define como esses dados deverão ser validados.
        return this.livrosService.criar(createLivroDto);
    }

    // Define o endpoint GET/livros
    @Get()
    @ApiOperation({
        summary: 'Retornar todos os livros cadastrados'
    })
    @ApiResponse({
        status: 201,
        description: 'Lista de livros retornada com sucesso'
    })
    @ApiResponse({
        status: 404,
        description: 'Não foi possível retornar a lista de livros'
    })
    listarTodos() {
        return this.livrosService.listarTodos();
    };

    // Define o endpoint GET/livros/:id
    @Get(':id')
    @ApiOperation({
        summary: 'Localizar livro pelo ID'
    })
    @ApiResponse({
        status: 201,
        description: 'Livro encontrado com sucesso'
    })
    @ApiResponse({
        status: 404,
        description: 'Livro não encontrado'
    })
    buscaPorId(
        @Param('id', ParseIntPipe) id: number
    ) {
        return this.livrosService.buscaPorId(id);
    }

    // Define o endpoint PUT /livros/:id
    @Put(':id')
    @ApiOperation({
        summary: 'Atualizar livro pelo ID'
    })
    @ApiResponse({
        status: 201,
        description: 'Livro atualizado com sucesso'
    })
    @ApiResponse({
        status: 404,
        description: 'Não foi possível atualizar o livro'
    })
    atualizar(@Param('id') id: number, @Body() dados: updateLivroDto) {
        return this.livrosService.atualizar(id, dados);
    }

    // Define o endpoint DELETE /livros/:id
    @Delete(':id')
    @ApiOperation({
        summary: 'Remover livro por ID'
    })
    @ApiResponse({
        status: 201,
        description: 'Livro removido com sucesso'
    })
    @ApiResponse({
        status: 404,
        description: 'Não foi possível remover o livro'
    })
    remover(@Param('id') id: number) {
        return this.livrosService.remover(id);
    }

}
