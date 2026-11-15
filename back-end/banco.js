import Database from 'better-sqlite3';
import { fileURLToPath } from 'node:url';
import path from 'node:path';



// banco do projeto e o arquivo único alunos.sqlite, criado na pasta do back-end
const pastaAtual = path.dirname(fileURLToPath(import.meta.url));
const banco = new Database(path.join(pastaAtual, 'alunos.sqlite'));



// cria a tabela na primeira vez que o servidor roda
banco.exec(`
  CREATE TABLE IF NOT EXISTS alunos (
    ra             INTEGER PRIMARY KEY,
    nome           TEXT NOT NULL,
    dataNascimento TEXT NOT NULL,
    nota1          REAL,
    nota2          REAL,
    media          REAL,
    situacao       TEXT
  )
`);


export default banco;