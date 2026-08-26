import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAutorDto } from './dto/create-autor.dto';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { DatabaseService } from 'src/database/database.service';
import { UpdateAtorDto } from './dto/update-autor.dto';
import { updateLivroDto } from 'src/livros/dto/update-livro.dto';

@Injectable()
export class AutoresService {
    constructor (private readonly databaseService:DatabaseService){}

    async criar(createAutorDto:CreateAutorDto){
        const {nome, nacionalidade, ano_nascimento} = createAutorDto;
        const sql = `
            INSERT INTO autor (nome, nacionalidade, ano_nascimento) VALUES (?,?,?)
        `;
        const resultado = await this.databaseService.query(
            sql, [nome, nacionalidade, ano_nascimento]) as ResultSetHeader;
            return {
                mensagem: 'Autor cadastrado com sucesso',
                autor: {
                id:resultado.insertId,
                nome,
                nacionalidade,
                ano_nascimento
                }
            };
    }

    async listarTodos(){
        const resultado = await this.databaseService.query(
            'SELECT * FROM autor'
        );
        return resultado;
    }

    async buscarPorId(id:number){
        const resultado = await this.databaseService.query(
            'SELECT * FROM autor WHERE id = ?', [id]
        ) as RowDataPacket[]
        if (resultado.length === 0) {
            throw new NotFoundException('id não encontrado')
        }
        return resultado[0];
    }

    async atualizar(id:number, dados: UpdateAtorDto){
        await this.buscarPorId(id);
        await this.databaseService.query(
            'UPDATE autor SET nome = ?, nacionalidade = ?, ano_nascimento = ? WHERE id = ?', [dados.nome, dados.nacionalidade, dados.ano_nascimento, id]
        )
        return {
            mensagem: 'Autor atualizado com sucesso'
        }
    }

    async remover(id:number){
        await this.buscarPorId(id);
        await this.databaseService.query(
            'DELETE FROM autor WHERE id = ?', [id]
        )
        return {
            mensagem: 'Autor excluido com sucesso'
        }
    }
}
