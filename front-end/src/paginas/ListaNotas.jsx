import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import api, { mensagemDeErro } from '../servicos/api';
import { formatarNota } from '../utilitarios';
import Aviso from '../componentes/Aviso';
import EtiquetaSituacao from '../componentes/EtiquetaSituacao';



export default function ListaNotas() {
  const local = useLocation();
  const navegar = useNavigate();

  const [alunos, setAlunos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [aviso, setAviso] = useState(local.state?.aviso ?? null);

  useEffect(() => {
    async function carregarAlunos() {
      try {
        const resposta = await api.get('/alunos');
        setAlunos(resposta.data);
      } catch (erro) {
        setAviso({ tipo: 'erro', texto: mensagemDeErro(erro) });
      } finally {
        setCarregando(false);
      }
    }
    carregarAlunos();
    // Limpa o aviso vindo de outra página
    if (local.state?.aviso) navegar(local.pathname, { replace: true, state: null });
  }, []);

  return (
    <section>
      <h1 className="text-3xl">Listar notas</h1>
      <p className="mb-8 mt-1 text-sm text-tinta-suave">
        Notas, média e situação de cada aluno.
      </p>

      {aviso && <Aviso tipo={aviso.tipo} texto={aviso.texto} aoFechar={() => setAviso(null)} />}

      {carregando && <p className="text-sm text-tinta-suave">Carregando…</p>}

      {!carregando && alunos.length === 0 && (
        <div className="border-t border-linha py-10">
          <p className="mb-4 text-tinta-suave">Nenhum aluno cadastrado ainda.</p>
          <Link to="/cadastro" className="botao botao-principal">
            <UserPlus size={16} strokeWidth={1.5} />
            Cadastrar aluno
          </Link>
        </div>
      )}

      {!carregando && alunos.length > 0 && (
        <div className="overflow-x-auto">
          <table className="tabela">
            <thead>
              <tr>
                <th>RA</th>
                <th>Nome</th>
                <th>Nota 1</th>
                <th>Nota 2</th>
                <th>Média</th>
                <th>Situação</th>
              </tr>
            </thead>
            <tbody>
              {alunos.map((aluno) => (
                <tr key={aluno.ra}>
                  <td>{aluno.ra}</td>
                  <td>{aluno.nome}</td>
                  <td>{formatarNota(aluno.nota1)}</td>
                  <td>{formatarNota(aluno.nota2)}</td>
                  <td className="font-medium">{formatarNota(aluno.media)}</td>
                  <td><EtiquetaSituacao situacao={aluno.situacao} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
