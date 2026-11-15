import axios from 'axios';

// Endereço da API (back-end roda na porta 8081
const api = axios.create({
  baseURL: 'http://localhost:8081/api',
});

// Transforma um erro da API em uma frase para mostrar ao usuário
export function mensagemDeErro(erro) {
  if (erro.response?.data?.erro) return erro.response.data.erro;
  if (erro.request) return 'Não foi possível falar com a API. Confira se ela está rodando.';
  return 'Algo deu errado. Tente novamente.';
}

export default api;
