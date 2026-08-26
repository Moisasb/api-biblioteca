import { Controller, Body, Post, Get, Param, ParseIntPipe, Put, Delete } from '@nestjs/common';
import { AutoresService } from './autores.service';
import { CreateAutorDto } from './dto/create-autor.dto';
import { UpdateAtorDto } from './dto/update-autor.dto';
import { ApiTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

@ApiTags('Autores')
@Controller('autores')
export class AutoresController {
    constructor (private readonly autoresService:AutoresService){}

    @Post()
    @ApiOperation({
        summary: 'Cadastrar um novo autor'
    })
    @ApiResponse({
        status: 201,
        description: 'Autor cadastrado com sucesso'
    })
    @ApiResponse({
        status: 404,
        description: 'Não foi possível cadastrar este autor'
    })
    criar(@Body() createAutorDto:CreateAutorDto){
        return this.autoresService.criar(createAutorDto);
    };

    @Get()
    @ApiOperation({
        summary: 'Retornar todos os autores cadastrados'
    })
    @ApiResponse({
        status: 201,
        description: 'Lista de autores retornada com sucesso'
    })
    @ApiResponse({
        status: 404,
        description: 'Não foi possível retornar a lista de autores'
    })
    listarTodos(){
        return this.autoresService.listarTodos();
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Localizar autor pelo ID'
    })
    @ApiResponse({
        status: 201,
        description: 'Autor encontrado com sucesso'
    })
    @ApiResponse({
        status: 404,
        description: 'Autor não encontrado'
    })
    buscarPorId(@Param('id', ParseIntPipe) id: number){
        return this.autoresService.buscarPorId(id);
    }

    @Put(':id')
    @ApiOperation({
        summary: 'Atualizar autor pelo ID'
    })
    @ApiResponse({
        status: 201,
        description: 'Autor atualizado com sucesso'
    })
    @ApiResponse({
        status: 404,
        description: 'Não foi possível atualizar o autor'
    })
    atualizar(@Param('id', ParseIntPipe) id:number, @Body() dados: UpdateAtorDto) {
        return this.autoresService.atualizar(id,dados);
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Remover autor por ID'
    })
    @ApiResponse({
        status: 201,
        description: 'Autor removido com sucesso'
    })
    @ApiResponse({
        status: 404,
        description: 'Não foi possível remover o autor'
    })
    remover(@Param('id', ParseIntPipe) id:number){
        return this.autoresService.remover(id);
    }
}
