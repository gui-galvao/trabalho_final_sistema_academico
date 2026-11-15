import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { UserPlus, Check } from 'lucide-react';
import api, { mensagemDeErro } from '../servicos/api';
import Aviso from '../componentes/Aviso';

// Pag para cadastrar (/cadastro) e para editar (/editar/:ra)
export default function FormularioAluno() {
  const { ra } = useParams();
  const editando = Boolean(ra);
  const navegar = useNavigate();

  const [dadosAluno, setDadosAluno] = useState({ ra: '', nome: '', dataNascimento: '' });
  const [aviso, setAviso] = useState(null);
  const [salvando, setSalvando] = useState(false);



  // Na edição busca os dados atuais do aluno para preencher o form
  useEffect(() => {
    if (!editando) return;
    async function carregarAluno() {
      try {
        const resposta = await api.get(`/alunos/${ra}`);
        setDadosAluno(resposta.data);
      } catch (erro) {
        setAviso({ tipo: 'erro', texto: mensagemDeErro(erro) });
      }
    }
    carregarAluno();
  }, [ra]);



  // atualiza o campo que a pessoa esta digitando
  function mudarCampo(evento) {
    const { name, value } = evento.target;
    setDadosAluno((dadosAtuais) => ({ ...dadosAtuais, [name]: value }));
  }

  async function salvarAluno(evento) {
    evento.preventDefault();
    setAviso(null);
    setSalvando(true);
    try {
      if (editando) {
        await api.put(`/alunos/${ra}`, {
          nome: dadosAluno.nome,
          dataNascimento: dadosAluno.dataNascimento,
        });
      } else {
        await api.post('/alunos', {
          ra: Number(dadosAluno.ra),
          nome: dadosAluno.nome,
          dataNascimento: dadosAluno.dataNascimento,
        });
      }
      const texto = editando ? 'Aluno atualizado.' : 'Aluno cadastrado.';
      navegar('/', { state: { aviso: { tipo: 'sucesso', texto } } });
    } catch (erro) {
      setAviso({ tipo: 'erro', texto: mensagemDeErro(erro) });
      setSalvando(false);
    }
  }

  return (
    <section className="max-w-md">
      <h1 className="text-3xl">{editando ? 'Editar aluno' : 'Cadastrar aluno'}</h1>
      <p className="mb-8 mt-1 text-sm text-tinta-suave">
        {editando ? 'O RA não pode ser alterado.' : 'Cada aluno precisa de um RA único.'}
      </p>

      {aviso && <Aviso tipo={aviso.tipo} texto={aviso.texto} aoFechar={() => setAviso(null)} />}

      <form onSubmit={salvarAluno} className="space-y-5">
        <div>
          <label htmlFor="ra" className="rotulo">RA</label>
          <input
            id="ra"
            name="ra"
            type="text"
            inputMode="numeric"
            pattern="[0-9]+"
            title="Use somente números"
            required
            readOnly={editando}
            value={dadosAluno.ra}
            onChange={mudarCampo}
            className="campo"
          />
        </div>

        <div>
          <label htmlFor="nome" className="rotulo">Nome</label>
          <input
            id="nome"
            name="nome"
            type="text"
            required
            value={dadosAluno.nome}
            onChange={mudarCampo}
            className="campo"
          />
        </div>

        <div>
          <label htmlFor="dataNascimento" className="rotulo">Data de nascimento</label>
          <input
            id="dataNascimento"
            name="dataNascimento"
            type="date"
            required
            value={dadosAluno.dataNascimento}
            onChange={mudarCampo}
            className="campo"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button type="submit" disabled={salvando} className="botao botao-principal disabled:opacity-60">
            {editando ? <Check size={16} strokeWidth={1.5} /> : <UserPlus size={16} strokeWidth={1.5} />}
            {editando ? 'Salvar alterações' : 'Cadastrar aluno'}
          </button>
          <Link to="/" className="botao botao-simples">Cancelar</Link>
        </div>
      </form>
    </section>
  );
}
