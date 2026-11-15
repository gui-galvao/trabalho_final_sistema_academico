import express from 'express';
import cors from 'cors';
import rotasAlunos from './rotas/alunos.js';

const app=express();
const porta =8081;


// libera o front (Vite roda na porta 5173) para chamar a API
app.use(cors({ origin: ['http://localhost:5173', 'http://127.0.0.1:5173'] }));
app.use(express.json());



// Todas as rotas de alunos começam com /api/alunos
app.use('/api/alunos', rotasAlunos);



// Se o json vier quebrado ele avisa
app.use((erro, req, res, next) => {
  res.status(400).json({ erro: 'Dados inválidos.' });
});



app.listen(porta, () => {
  console.log(`API rodando em http://localhost:${porta}/api/alunos`);
});
