import { Router } from 'express';
import banco from '../banco.js';

const rotas = Router();

// FUNÇÕES

// para calcular a media dos alunos e se foi aprovado
function calcularMediaESituacao(nota1, nota2) {
  const media= Math.round(((nota1+nota2) / 2) * 100) / 100;
  const situacao = media >= 7 ? 'Aprovado' : 'Reprovado';
  return { media, situacao };
}



// transforma valor recebnido em nro (vazio ou nulo vira NaN, que é inválido)
function lerNota(valor) {
  if (valor === '' || valor=== null || valor === undefined) return NaN;
  return Number(valor);
}



// confere se a nota é um número entre 0 e 10
function notaValida(nota) {
  return Number.isFinite(nota) && nota >=0 && nota <= 10;
}



// Validar data no formato AAAA-MM-Dd
function dataValida(data) {
  return typeof data=== 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data);
}



// devolve o aluno do banco, ou dá undefined se o RA nao existir
function buscarAluno(ra) {
  return banco.prepare('SELECT * FROM alunos WHERE ra = ?').get(ra);
}



// ROTAS

// listar alunos
rotas.get('/', (req, res) => {
  const alunos = banco.prepare('SELECT * FROM alunos ORDER BY nome').all();
  res.json(alunos);
});



// Buscar por RA
rotas.get('/:ra', (req, res) => {
  const aluno = buscarAluno(Number(req.params.ra));
  if (!aluno) return res.status(404).json({ erro: 'Aluno não encontrado.' });
  res.json(aluno);
});



// Cadastrar aluno
rotas.post('/', (req, res) => {
  const { ra, nome, dataNascimento } = req.body;

  if (!Number.isInteger(ra) || ra <= 0) {
    return res.status(400).json({ erro: 'Informe um RA válido (somente números).' });
  }
  if (typeof nome !== 'string' || nome.trim() === '') {
    return res.status(400).json({ erro: 'Informe o nome do aluno.' });
  }
  if (!dataValida(dataNascimento)) {
    return res.status(400).json({ erro: 'Informe uma data de nascimento válida.' });
  }
  if (buscarAluno(ra)) {
    return res.status(409).json({ erro: 'RA já cadastrado.' });
  }

  banco
    .prepare('INSERT INTO alunos (ra, nome, dataNascimento) VALUES (?, ?, ?)')
    .run(ra, nome.trim(), dataNascimento);

  res.status(201).json(buscarAluno(ra));
});



// Editar nome e data de nascimento (lembrar de explicar que RA nao muda)
rotas.put('/:ra', (req, res) => {
  const ra = Number(req.params.ra);
  const { nome, dataNascimento } = req.body;

  if (!buscarAluno(ra)) return res.status(404).json({ erro: 'Aluno não encontrado.' });
  if (typeof nome !== 'string' || nome.trim() === '') {
    return res.status(400).json({ erro: 'Informe o nome do aluno.' });
  }
  if (!dataValida(dataNascimento)) {
    return res.status(400).json({ erro: 'Informe uma data de nascimento válida.' });
  }

  banco
    .prepare('UPDATE alunos SET nome = ?, dataNascimento = ? WHERE ra = ?')
    .run(nome.trim(), dataNascimento, ra);

  res.json(buscarAluno(ra));
});



// excluir aluno
rotas.delete('/:ra', (req, res) => {
  const ra = Number(req.params.ra);
  if (!buscarAluno(ra)) return res.status(404).json({ erro: 'Aluno não encontrado.' });

  banco.prepare('DELETE FROM alunos WHERE ra = ?').run(ra);
  res.json({ mensagem: 'Aluno excluído com sucesso.' });
});



// Gerenciar notas (aqui salva as duas notas e calcula media e situação
rotas.put('/gerenciar-notas/:ra', (req, res) => {
  const ra = Number(req.params.ra);
  const nota1 = lerNota(req.body.nota1);
  const nota2 = lerNota(req.body.nota2);

  if (!buscarAluno(ra)) return res.status(404).json({ erro: 'Aluno não encontrado.' });
  if (!notaValida(nota1) || !notaValida(nota2)) {
    return res.status(400).json({ erro: 'As notas devem estar entre 0 e 10.' });
  }

  const { media, situacao } = calcularMediaESituacao(nota1, nota2);

  banco
    .prepare('UPDATE alunos SET nota1 = ?, nota2 = ?, media = ?, situacao = ? WHERE ra = ?')
    .run(nota1, nota2, media, situacao, ra);

  res.json(buscarAluno(ra));
});

export default rotas;
