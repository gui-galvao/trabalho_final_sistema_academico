import { Routes, Route, Navigate } from 'react-router-dom';
import Menu from './componentes/Menu.jsx';
import ListaAlunos from './paginas/ListaAlunos.jsx';
import FormularioAluno from './paginas/FormularioAluno.jsx';
import GerenciarNotas from './paginas/GerenciarNotas.jsx';
import ListaNotas from './paginas/ListaNotas.jsx';

export default function App() {
  return (
    <>
      <Menu />
      <main className="mx-auto max-w-5xl px-6 py-10">
        <Routes>
          <Route path="/" element={<ListaAlunos />} />
          <Route path="/cadastro" element={<FormularioAluno />} />
          <Route path="/editar/:ra" element={<FormularioAluno />} />
          <Route path="/gerenciar-notas/:ra" element={<GerenciarNotas />} />
          <Route path="/listar-notas" element={<ListaNotas />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}
