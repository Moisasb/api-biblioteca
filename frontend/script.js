// Aqui estamos definindo a URL base do módulo de livros da nossa API NestJS.
const API_URL = 'http://localhost:3000/livros';
// URL base do módulo de autores da nossa API NestJS.
const API_URL_AUTORES = 'http://localhost:3000/autores';

// Elementos do HTML (livros)

const formLivro = document.querySelector('#form-livro');
const inputTitulo = document.querySelector('#titulo');
const inputAutor = document.querySelector('#autor');
const inputAno = document.querySelector('#ano');
const inputDisponivel = document.querySelector('#disponivel');
const listaLivros = document.querySelector('#lista-livros');
const botaoAtualizar = document.querySelector('#botao-atualizar');
// Mensagem é compartilhada entre livros e autores
const mensagem = document.querySelector('#mensagem');

// Elementos do HTML (autores)

const formAutor = document.querySelector('#form-autor');
const inputNome = document.querySelector('#nome');
const inputNacionalidade = document.querySelector('#nacionalidade');
const inputAnoNascimento = document.querySelector('#ano_nascimento');
const listaAutores = document.querySelector('#lista-autores');
const botaoAtualizarAutores = document.querySelector('#botao-atualizar-autores');

// Essa variável vai servir para identificar se estamos ou não editando um livro
let livroEmEdicao = null;
// Essa variável vai servir para identificar se estamos ou não editando um autor
let autorEmEdicao = null;

// Função que irá buscar todos os livros (GET /livros)
async function buscarLivros(){
    try {
        // Realiza uma requisição GET para a nossa API
        const resposta = await fetch(API_URL);
        // Verifica se ocorreu algum erro durante a requisição
        if (!resposta.ok){
            throw new Error('Não foi possível buscar os livros');
        };
        // Converte a repsosta da API para um objeto JavaScrip
        const livros = await resposta.json();
        // Envia os livros encontrados para a função responsável pela exibição deles na tela
        mostrarLivros(livros);
    } catch (erro) {
        // Função responsável por gerir os tipos de respostas diferentes
        mostrarMensagem(erro.mensagem, 'erro');
    }
}
// Função responsável por exibir os livros na tela
function mostrarLivros(livros){
    // Limpa a tabela antes de inserir os dados
    listaLivros.innerHTML = '';
    // Caso não exista nenhum livro cadastrado, mostramos uma mensagem na tabela de livros
    if (livros.length === 0){
        listaLivros.innerHTML = `
        <tr class="linha-vazia">
            <td colspan=6>
                Nenhum livro cadastrado.
            </td>
        </tr> 
        `;
        return;
    }
    // Percorre todos os livros retornados pela API
    livros.forEach((livro) => {
        const linha = document.createElement('tr');
        // Monta a estruturação de como os livros serão exibidos na tela
        linha.innerHTML = `
            <td>${livro.id}</td>
            <td>${livro.titulo}</td>
            <td>${livro.autor}</td>
            <td>${livro.ano}</td>
            <td>
            <span class="${livro.disponivel ? 'disponivel' : 'indisponivel'}">
            ${livro.disponivel ? 'Sim':'Não'}
            </span>
            </td>
            <td>
            <button class="botao botao-editar" onclick="editarLivro(${livro.id})"> Editar </button>
            <button class="botao botao-excluir" onclick="excluirLivro(${livro.id})"> Excluir </button>
            </td>
        `;
        // Adiciona sempre as novas linhas abaixo das existentes (dentro da tabela)
        listaLivros.appendChild(linha);
    });
}
// Função responsável por realizar o cadastros de novos livros (no banco de dados)
// Ele quem fará o POST /livros
async function cadastrarLivro(event){
    // Impede que o formulário regarregue a página inteira
    event.preventDefault();

    // Recupera os valores digitados pelo usuário e monta um objeto que será enviado para a API
    const livro = {
        titulo: inputTitulo.value,
        autor: inputAutor.value,
        ano: Number(inputAno.value),
        disponivel: inputDisponivel.value === '1',
    };

    try {
        // Se existir um livro em edição, vamos chamar a função responsável
        if (livroEmEdicao !== null){
            await atualizarLivro(livroEmEdicao, livro);
            return;
        }
        // Faz uma requisição do tipo POST enviando através do body (corpo da requisição), o livro que construimos acima
        const resposta = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(livro)
        });
        // Caso a API retorne algum erro no cadastramento do livro
        if (!resposta.ok) {
            const erro = await resposta.json();
            throw new Error(erro.message || 'Não foi possível cadastrar o livro');
        }
        // Se der tudo certo com o cadastramento do livro
        mostrarMensagem('Livro cadastrado com sucesso', 'sucesso');
        // Limpa os campos do formulário após o cadatro
        formLivro.reset();
        // Atualizamos a lista de livros
        buscarLivros();
    } catch (erro) {
        mostrarMensagem(erro.message, 'erro');
    }
}
async function editarLivro(id){
    try{
        // Para editar um livro, nós vamos fazer a busca pelo ID
        // Caracteristico do nosso edpoint GET /livros/id
        const resposta = await fetch(`${API_URL}/${id}`);
        // Caso não tenhamos conseguido acessar o livro para editar
        if(!resposta.ok){
            throw new Error('Livro não encontrado.');
        }
        // Recebemos os dados do livro que desejamos alterar
        const livro = await resposta.json();
        // Preenche o formulário com os dados atuais do livro, trazidos do banco (eles serão colocados de volta nos inputs)
        inputTitulo.value = livro.titulo;
        inputAutor.value = livro.autor;
        inputAno.value = livro.ano;
        inputDisponivel.value = livro.disponivel ? '1' : '0';
        // Guarda o ID do livro que está sendo editado
        livroEmEdicao = id;
        // Altera o texto do botão
        document.querySelector('#botao-salvar').textContent = 'Salvar alterações';
    } catch(erro) {
        mostrarMensagem(erro.message, 'erro');
    }
}

async function atualizarLivro(id, livro){
    try {
        // Enviamos a requisição do tipo PUT contendo as informações a serem atualizadas
        const resposta = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(livro)
        });
        // Caso não seja possível realizar a atualização do livro, trazemos a mensagem da api.
        if(!resposta.ok){
            const erro = await resposta.json();
            throw new Error(erro.message || 'Não foi possível atualizar o livro');
        }
        // Se a atualização funcionou normalmente, exibimos mensagem de sucesso
        mostrarMensagem('Livro atualizado com sucesso!', 'sucesso');
        // A variável volta a ser nula pois não temos mais um livro sendo editado
        livroEmEdicao = null;
        // Limpa o formulário
        formLivro.reset();
        // Voltamos o texto original do botão
        document.querySelector('#botao-salvar').textContent = 'Cadastrar livro';
        // E atualizamos a listagem dos livros
        buscarLivros();
    } catch(erro) {
        mostrarMensagem(erro.message, 'erro');
    }
}
// Função responsável por excluir um livro
async function excluirLivro(id){
    // Exibe um alerta de confirmação para que o usuário confirme se realmente deseja excluir o livro (por questões de segurança)
    const confirmar = confirm('Deseja realmente excluir este livro?');
    // Se ele disser que não, então não vamos excluir, voltamos a tela normalmente
    if (!confirmar){
        return;
    }
    // Se ele confirmar para que continuemos a exclusão
    try {
        // Enviamos uma requisição do tipo DELETE com o ID em parametro
        const resposta = await fetch (`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!resposta.ok){
            const erro = await resposta.json();
            throw new Error(erro.message || 'Não foi possível excluir o livro.');
        }
        // Exibimos a mensagem de sucesso e atualizamos a página
        mostrarMensagem('Livro excluido com sucesso!', 'sucesso');
        buscarLivros();
    } catch (erro) {
        mostrarMensagem(erro.message, 'erro');
    }
}
// ==========================================================
// MÓDULO DE AUTORES
// (segue exatamente o mesmo padrão usado acima para livros)
// ==========================================================

// Função que irá buscar todos os autores (GET /autores)
async function buscarAutores(){
    try {
        const resposta = await fetch(API_URL_AUTORES);
        if (!resposta.ok){
            throw new Error('Não foi possível buscar os autores');
        };
        const autores = await resposta.json();
        mostrarAutores(autores);
    } catch (erro) {
        mostrarMensagem(erro.message, 'erro');
    }
}

// Função responsável por exibir os autores na tela
function mostrarAutores(autores){
    listaAutores.innerHTML = '';
    if (autores.length === 0){
        listaAutores.innerHTML = `
        <tr class="linha-vazia">
            <td colspan=5>
                Nenhum autor cadastrado.
            </td>
        </tr>
        `;
        return;
    }
    autores.forEach((autor) => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td>${autor.id}</td>
            <td>${autor.nome}</td>
            <td>${autor.nacionalidade}</td>
            <td>${autor.ano_nascimento}</td>
            <td>
            <button class="botao botao-editar" onclick="editarAutor(${autor.id})"> Editar </button>
            <button class="botao botao-excluir" onclick="excluirAutor(${autor.id})"> Excluir </button>
            </td>
        `;
        listaAutores.appendChild(linha);
    });
}

// Função responsável por cadastrar um novo autor (POST /autores)
async function cadastrarAutor(event){
    event.preventDefault();

    // Importante: só enviamos os campos que o CreateAutorDto espera.
    // A API está com forbidNonWhitelisted ativo, então qualquer campo
    // extra (ex: "ativo") faria a requisição ser rejeitada com erro 400.
    const autor = {
        nome: inputNome.value,
        nacionalidade: inputNacionalidade.value,
        ano_nascimento: Number(inputAnoNascimento.value),
    };

    try {
        if (autorEmEdicao !== null){
            await atualizarAutor(autorEmEdicao, autor);
            return;
        }
        const resposta = await fetch(API_URL_AUTORES, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(autor)
        });
        if (!resposta.ok) {
            const erro = await resposta.json();
            throw new Error(erro.message || 'Não foi possível cadastrar o autor');
        }
        mostrarMensagem('Autor cadastrado com sucesso', 'sucesso');
        formAutor.reset();
        buscarAutores();
    } catch (erro) {
        mostrarMensagem(erro.message, 'erro');
    }
}

// Função responsável por preencher o formulário com os dados do autor (GET /autores/:id)
async function editarAutor(id){
    try{
        const resposta = await fetch(`${API_URL_AUTORES}/${id}`);
        if(!resposta.ok){
            throw new Error('Autor não encontrado.');
        }
        const autor = await resposta.json();
        inputNome.value = autor.nome;
        inputNacionalidade.value = autor.nacionalidade;
        inputAnoNascimento.value = autor.ano_nascimento;
        autorEmEdicao = id;
        document.querySelector('#botao-salvar-autor').textContent = 'Salvar alterações';
    } catch(erro) {
        mostrarMensagem(erro.message, 'erro');
    }
}

// Função responsável por atualizar um autor existente (PUT /autores/:id)
async function atualizarAutor(id, autor){
    try {
        const resposta = await fetch(`${API_URL_AUTORES}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(autor)
        });
        if(!resposta.ok){
            const erro = await resposta.json();
            throw new Error(erro.message || 'Não foi possível atualizar o autor');
        }
        mostrarMensagem('Autor atualizado com sucesso!', 'sucesso');
        autorEmEdicao = null;
        formAutor.reset();
        document.querySelector('#botao-salvar-autor').textContent = 'Cadastrar autor';
        buscarAutores();
    } catch(erro) {
        mostrarMensagem(erro.message, 'erro');
    }
}

// Função responsável por excluir um autor (DELETE /autores/:id)
async function excluirAutor(id){
    const confirmar = confirm('Deseja realmente excluir este autor?');
    if (!confirmar){
        return;
    }
    try {
        const resposta = await fetch(`${API_URL_AUTORES}/${id}`, {
            method: 'DELETE'
        });
        if (!resposta.ok){
            const erro = await resposta.json();
            throw new Error(erro.message || 'Não foi possível excluir o autor.');
        }
        mostrarMensagem('Autor excluído com sucesso!', 'sucesso');
        buscarAutores();
    } catch (erro) {
        mostrarMensagem(erro.message, 'erro');
    }
}

// Função responsável pelo aparecimento dos balões de mensagens
// Aqui teremos 2 parâmentros: texto e tipo
function mostrarMensagem(texto, tipo){
    // Aqui trazemos o texto que escrevemos na função
    mensagem.textContent = texto;
    // Aqui vamos adequar a classe da mensagem
    mensagem.className = 'mensagem';
    if (tipo === 'sucesso'){
        mensagem.classList.add('mensagem-sucesso');
    } else {
        mensagem.classList.add('mensagem-erro');
    }
    // Após alguns segundos, essa mensagem irá desaparecer
    setTimeout(() => {
        mensagem.className = 'mensagem';
        mensagem.textContent = '';
    }, 3000);
}
// Quando o formulário for enviado, executamos a função de cadastro
formLivro.addEventListener('submit', cadastrarLivro);
// Quando o botão atualizar for clicado, buscamos novamente os livros na API.
botaoAtualizar.addEventListener('click', buscarLivros);

// Quando o formulário de autores for enviado, executamos a função de cadastro
formAutor.addEventListener('submit', cadastrarAutor);
// Quando o botão atualizar (autores) for clicado, buscamos novamente os autores na API.
botaoAtualizarAutores.addEventListener('click', buscarAutores);

// Assim que o JavaScript for carregado, buscamos livros e autores automaticamente
buscarLivros();
buscarAutores();