import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Check } from 'lucide-react';
import api, { mensagemDeErro } from '../servicos/api';
import { formatarData, calcularMedia, formatarNota } from '../utilitarios';
import Aviso from '../componentes/Aviso';
import EtiquetaSituacao from '../componentes/EtiquetaSituacao';



export default function GerenciarNotas() {
  const { ra } = useParams();
  const navegar = useNavigate();

  const [aluno, setAluno] = useState(null);
  const [nota1, setNota1] = useState('');
  const [nota2, setNota2] = useState('');
  const [aviso, setAviso] = useState(null);
  const [salvando, setSalvando] = useState(false);



  // busca o aluno e preenche as notas que ele tiver
  useEffect(() => {
    async function carregarAluno() {
      try {
        const resposta = await api.get(`/alunos/${ra}`);
        setAluno(resposta.data);
        setNota1(String(resposta.data.nota1 ?? ''));
        setNota2(String(resposta.data.nota2 ?? ''));
      } catch (erro) {
        setAviso({ tipo: 'erro', texto: mensagemDeErro(erro) });
      }
    }
    carregarAluno();
  }, [ra]);

  async function salvarNotas(evento) {
    evento.preventDefault();
    setAviso(null);
    setSalvando(true);
    try {
      await api.put(`/alunos/gerenciar-notas/${ra}`, {
        nota1: Number(nota1),
        nota2: Number(nota2),
      });
      navegar('/listar-notas', { state: { aviso: { tipo: 'sucesso', texto: 'Notas salvas.' } } });
    } catch (erro) {
      setAviso({ tipo: 'erro', texto: mensagemDeErro(erro) });
      setSalvando(false);
    }
  }



  // Previa da média enquanto a nota e duigitada
  const previa = nota1 !== '' && nota2 !== '' ? calcularMedia(Number(nota1), Number(nota2)) : null;

  return (
    <section className="max-w-md">
      <h1 className="text-3xl">Gerenciar notas</h1>
      <p className="mb-8 mt-1 text-sm text-tinta-suave">
        A média é calculadas ao salvar, aprovado com média 7 pra cima
      </p>

      {aviso && <Aviso tipo={aviso.tipo} texto={aviso.texto} aoFechar={() => setAviso(null)} />}

      {aluno && (
        <>
          <dl className="mb-8 grid grid-cols-[auto_1fr] gap-x-8 gap-y-1.5 border-y border-linha py-4 text-sm">
            <dt className="text-tinta-suave">RA</dt>
            <dd>{aluno.ra}</dd>
            <dt className="text-tinta-suave">Nome</dt>
            <dd>{aluno.nome}</dd>
            <dt className="text-tinta-suave">Nascimento</dt>
            <dd>{formatarData(aluno.dataNascimento)}</dd>
          </dl>

          <form onSubmit={salvarNotas} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="nota1" className="rotulo">Nota 1</label>
                <input
                  id="nota1"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  required
                  value={nota1}
                  onChange={(evento) => setNota1(evento.target.value)}
                  className="campo"
                />
              </div>
              <div>
                <label htmlFor="nota2" className="rotulo">Nota 2</label>
                <input
                  id="nota2"
                  type="number"
                  min="0"
                  max="10"
                  step="0.1"
                  required
                  value={nota2}
                  onChange={(evento) => setNota2(evento.target.value)}
                  className="campo"
                />
              </div>
            </div>

            <div className="flex min-h-8 items-center gap-3 text-sm">
              <span className="text-tinta-suave">Média</span>
              {previa ? (
                <>
                  <span className="font-medium">{formatarNota(previa.media)}</span>
                  <EtiquetaSituacao situacao={previa.situacao} />
                </>
              ) : (
                <span className="text-tinta-suave">—</span>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button type="submit" disabled={salvando} className="botao botao-principal disabled:opacity-60">
                <Check size={16} strokeWidth={1.5} />
                Salvar notas
              </button>
              <Link to="/" className="botao botao-simples">Cancelar</Link>
            </div>
          </form>
        </>
      )}
    </section>
  );
}
