import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, X, Pencil, NotebookPen, Trash2, UserPlus } from 'lucide-react';
import api, { mensagemDeErro } from '../servicos/api';
import { formatarData } from '../utilitarios';
import Aviso from '../componentes/Aviso';
import ModalConfirmar from '../componentes/ModalConfirmar';



export default function ListaAlunos() {
  const local = useLocation();
  const navegar = useNavigate();

  const [alunos, setAlunos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [textoBusca, setTextoBusca] = useState('');
  const [buscaAplicada, setBuscaAplicada] = useState('');
  const [aviso, setAviso] = useState(local.state?.aviso ?? null);
  const [alunoParaExcluir, setAlunoParaExcluir] = useState(null);

  useEffect(() => {
    carregarAlunos();
    // Limpa o aviso vindo de outra pag
    if (local.state?.aviso) navegar(local.pathname, { replace: true, state: null });
  }, []);



  // Busca todos alunos na API
  async function carregarAlunos() {
    setCarregando(true);
    try {
      const resposta = await api.get('/alunos');
      setAlunos(resposta.data);
      setBuscaAplicada('');
    } catch (erro) {
      setAviso({ tipo: 'erro', texto: mensagemDeErro(erro) });
    } finally {
      setCarregando(false);
    }
  }



  // Busca um aluno pelo RA (campo vazio = mostra todo mundo)
  async function buscarPorRa(evento) {
    evento.preventDefault();
    const raBuscado = textoBusca.trim();
    if (raBuscado === '') return carregarAlunos();

    setCarregando(true);
    try {
      const resposta = await api.get(`/alunos/${raBuscado}`);
      setAlunos([resposta.data]);
      setBuscaAplicada(raBuscado);
    } catch (erro) {
      if (erro.response?.status === 404) {
        setAlunos([]);
        setBuscaAplicada(raBuscado);
      } else {
        setAviso({ tipo: 'erro', texto: mensagemDeErro(erro) });
      }
    } finally {
      setCarregando(false);
    }
  }

  function limparBusca() {
    setTextoBusca('');
    carregarAlunos();
  }


  
  // Exclui o aluno escolhido na janela de confirmação
  async function excluirAluno() {
    const aluno = alunoParaExcluir;
    setAlunoParaExcluir(null);
    try {
      await api.delete(`/alunos/${aluno.ra}`);
      setAviso({ tipo: 'sucesso', texto: 'Aluno excluído.' });
      setTextoBusca('');
      carregarAlunos();
    } catch (erro) {
      setAviso({ tipo: 'erro', texto: mensagemDeErro(erro) });
    }
  }

  return (
    <section>
      <h1 className="text-3xl">Lista de alunos</h1>
      <p className="mb-8 mt-1 text-sm text-tinta-suave">
        Edite os dados, gerencie as notas ou exclua um aluno.
      </p>

      {aviso && <Aviso tipo={aviso.tipo} texto={aviso.texto} aoFechar={() => setAviso(null)} />}

      <form onSubmit={buscarPorRa} className="mb-8 flex max-w-md gap-2">
        <div className="relative flex-1">
          <Search
            size={17}
            strokeWidth={1.5}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-tinta-suave"
          />
          <input
            type="text"
            inputMode="numeric"
            aria-label="Buscar aluno pelo RA"
            placeholder="Buscar por RA"
            value={textoBusca}
            onChange={(evento) => setTextoBusca(evento.target.value)}
            className="campo pl-10"
          />
        </div>
        <button type="submit" className="botao botao-principal">Buscar</button>
        {buscaAplicada && (
          <button type="button" onClick={limparBusca} className="botao botao-simples">
            <X size={16} strokeWidth={1.5} />
            Limpar
          </button>
        )}
      </form>

      {carregando && <p className="text-sm text-tinta-suave">Carregando…</p>}

      {!carregando && alunos.length === 0 && (
        <div className="border-t border-linha py-10">
          <p className="mb-4 text-tinta-suave">
            {buscaAplicada
              ? `Nenhum aluno encontrado com o RA ${buscaAplicada}.`
              : 'Nenhum aluno cadastrado ainda.'}
          </p>
          {!buscaAplicada && (
            <Link to="/cadastro" className="botao botao-principal">
              <UserPlus size={16} strokeWidth={1.5} />
              Cadastrar aluno
            </Link>
          )}
        </div>
      )}

      {!carregando && alunos.length > 0 && (
        <div className="overflow-x-auto">
          <table className="tabela">
            <thead>
              <tr>
                <th>RA</th>
                <th>Nome</th>
                <th className="hidden sm:table-cell">Nascimento</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {alunos.map((aluno) => (
                <tr key={aluno.ra}>
                  <td>{aluno.ra}</td>
                  <td>{aluno.nome}</td>
                  <td className="hidden whitespace-nowrap sm:table-cell">{formatarData(aluno.dataNascimento)}</td>
                  <td>
                    <div className="flex gap-2">
                      <Link
                        to={`/editar/${aluno.ra}`}
                        aria-label={`Editar ${aluno.nome}`}
                        className="botao botao-pequeno botao-editar"
                      >
                        <Pencil size={15} strokeWidth={1.5} />
                        <span className="hidden sm:inline">Editar</span>
                      </Link>
                      <Link
                        to={`/gerenciar-notas/${aluno.ra}`}
                        aria-label={`Gerenciar notas de ${aluno.nome}`}
                        className="botao botao-pequeno botao-notas"
                      >
                        <NotebookPen size={15} strokeWidth={1.5} />
                        <span className="hidden sm:inline">Gerenciar notas</span>
                      </Link>
                      <button
                        type="button"
                        aria-label={`Excluir ${aluno.nome}`}
                        onClick={() => setAlunoParaExcluir(aluno)}
                        className="botao botao-pequeno botao-excluir"
                      >
                        <Trash2 size={15} strokeWidth={1.5} />
                        <span className="hidden sm:inline">Excluir</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {alunoParaExcluir && (
        <ModalConfirmar
          titulo="Excluir aluno?"
          texto={`${alunoParaExcluir.nome} (RA ${alunoParaExcluir.ra}) e as notas dele serão removidos. Essa ação não pode ser desfeita.`}
          textoConfirmar="Excluir"
          aoConfirmar={excluirAluno}
          aoCancelar={() => setAlunoParaExcluir(null)}
        />
      )}
    </section>
  );
}
