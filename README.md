# Sistema Acadêmico

Trabalho final da disciplina de Desenvolvimento Web. É um sistema para cadastrar alunos, registrar notas e ver quem está aprovado, formado por uma API REST e uma interface web que conversam entre si.

## Autor

- Guilherme Domingues Galvão

## Estrutura do projeto

- **back-end/**: API REST em Node.js com Express, que guarda os dados em um banco SQLite.
- **front-end/**: interface em React (com Vite) e Tailwind CSS, que consome a API.

Sistema-academico/
Pasta back-end: API + banco de dados
Pasta front-end: telas do sistema

## Ferramentas utilizadas

A ideia foi montar um projeto fácil de rodar em qualquer computador, usando ferramentas atuais: basta ter o Node.js instalado!!

- **Node.js**: JavaScript no front e no back, uma linguagem só para o projeto inteiro.
- **Express**: cria a API REST com poucas linhas de código, fácil de ler.
- **SQLite**: banco de dados guardado em um único arquivo, criado sozinho na primeira execução. Não precisa instalar nem configurar servidor
- **React**: monta as telas com componentes reutilizáveis
- **Vite**: servidor de desenvolvimento rápido e com pouca configuração, no lugar do Create React App, que foi descontinuado.
- **Tailwind CSS**: o estilo é escrito direto nas classes, e as cores e fontes ficam definidas em um só lugar.
- **React Router**: troca de tela sem recarregar a página.
- **Axios**: faz as chamadas do front para a API.
- **Lucide React**: biblioteca de icones
- **Fontsource**: instala as fontes pelo npm, pro visual funcionar sem internet.



## Funcionalidades

### API (back-end)

- **Alunos:** cadastro com RA, nome e data de nascimento, além de edição e exclusão
- **Notas:** Salva duas notas, de 0 a 10, e calcula a média e a situação (Aprovado com média 7 ou mais)
- **Consultas:** lista todos os alunos ou busca um deles pelo RA.
- **Validações:** RA repetido, campos vazios e notas fora do intervalo recebem uma mensagem de erro clara.

### Interface (front-end)

- **Listar alunos:** tabela com busca por RA e os botões Editar, Gerenciar notas e Excluir.
- **Cadastrar aluno:** formulário com aviso quando o RA já existe.
- **Gerenciar notas:** digita as duas notas e vê a média antes de salvar.
- **Listar notas:** mostra notas, media e situação de cada aluno.
- **Avisos e confirmação:** mensagens de sucesso e erro na própria tela, e uma janela de confirmação antes de excluir.
- **Layout responsivo:** funciona no computador e no celular.



## Rotas principais

### API (porta 8081)

- Listar alunos: GET /api/alunos
- Buscar por RA: GET /api/alunos/{ra}
- Cadastrar aluno: POST /api/alunos
- Editar aluno: PUT /api/alunos/{ra}
- Excluir aluno: DELETE /api/alunos/{ra}
- Gerenciar notas: PUT /api/alunos/gerenciar-notas/{ra}



### Telas (porta 5173)

- Listar alunos: /
- Cadastrar aluno: /cadastro
- Editar aluno: /editar/{ra}
- Gerenciar notas: /gerenciar-notas/{ra}
- Listar notas: /listar-notas



## Pré-requisitos

- **Node.js 22 ou superior** (versão LTS), que já inclui o npm.

Para conferir a versão instalada, rode node -v no terminal.



## Como rodar o projeto

Abra dois terminais na pasta do projeto.

**Terminal 1: API**

bash
cd back-end
npm install
npm start


A API sobe em http://localhost:8081. O banco alunos.sqlite é criado automaticamente na pasta back-end.



**Terminal 2: interface**

bash
cd front-end
npm install
npm run dev


Depois, só abrir http://localhost:5173 no navegador